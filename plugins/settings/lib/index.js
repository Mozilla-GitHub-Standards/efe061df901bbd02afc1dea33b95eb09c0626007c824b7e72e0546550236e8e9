/* ***** BEGIN LICENSE BLOCK *****
 * Version: MPL 1.1/GPL 2.0/LGPL 2.1
 *
 * The contents of this file are subject to the Mozilla Public License Version
 * 1.1 (the "License"); you may not use this file except in compliance with
 * the License. You may obtain a copy of the License at
 * http://www.mozilla.org/MPL/
 *
 * Software distributed under the License is distributed on an "AS IS" basis,
 * WITHOUT WARRANTY OF ANY KIND, either express or implied. See the License
 * for the specific language governing rights and limitations under the
 * License.
 *
 * The Original Code is Mozilla Skywriter.
 *
 * The Initial Developer of the Original Code is
 * Mozilla.
 * Portions created by the Initial Developer are Copyright (C) 2009
 * the Initial Developer. All Rights Reserved.
 *
 * Contributor(s):
 *   Joe Walker (jwalker@mozilla.com)
 *   Julian Viereck (jviereck@mozilla.com)
 *   Kevin Dangoor (kdangoor@mozilla.com)
 *
 * Alternatively, the contents of this file may be used under the terms of
 * either the GNU General Public License Version 2 or later (the "GPL"), or
 * the GNU Lesser General Public License Version 2.1 or later (the "LGPL"),
 * in which case the provisions of the GPL or the LGPL are applicable instead
 * of those above. If you wish to allow use of your version of this file only
 * under the terms of either the GPL or the LGPL, and not to allow others to
 * use your version of this file under the terms of the MPL, indicate your
 * decision by deleting the provisions above and replace them with the notice
 * and other provisions required by the GPL or the LGPL. If you do not delete
 * the provisions above, a recipient may use your version of this file under
 * the terms of any one of the MPL, the GPL or the LGPL.
 *
 * ***** END LICENSE BLOCK ***** */

/**
 * This plug-in manages settings.
 *
 * <p>Some quick terminology: A _Choice_, is something that the application
 * offers as a way to customize how it works. For each _Choice_ there will be
 * a number of _Options_ but ultimately the user will have a _Setting_ for each
 * _Choice_. This _Setting_ maybe the default for that _Choice_.
 *
 * <p>It provides an API for controlling the known settings. This allows us to
 * provide better GUI/CLI support. See setting.js
 * <p>It provides 3 implementations of a setting store:<ul>
 * <li>MemorySettings: i.e. temporary, non-persistent. Useful in textarea
 * replacement type scenarios. See memory.js
 * <li>CookieSettings: Stores the data in a cookie. Generally not practical as
 * it slows client server communication (if any). See cookie.js
 * <li>ServerSettings: Stores data on a server using the <tt>server</tt> API.
 * See server.js
 * </ul>
 * <p>It is expected that an HTML5 storage option will be developed soon. This
 * plug-in did contain a prototype Gears implementation, however this was never
 * maintained, and has been deleted due to bit-rot.
 * <p>This plug-in also provides commands to manipulate the settings from the
 * command_line and canon plug-ins.
 *
 * <p>TODO:<ul>
 * <li>Check what happens when we alter settings from the UI
 * <li>Ensure that values can be bound in a SC sense
 * <li>Convert all subscriptions to bindings.
 * <li>Implement HTML5 storage option
 * <li>Make all settings have a 'description' member and use that in set|unset
 * commands.
 * <li>When the command system is re-worked to include more GUI interaction,
 * expose data in settings to that system.
 * </ul>
 *
 * <p>For future versions of the API it might be better to decrease the
 * dependency on settings, and increase it on the system with a setting.
 * e.g. Now:
 * <pre>
 * setting.addSetting({ name:'foo', ... });
 * settings.set('foo', 'bar');
 * </pre>
 * <p>Vs the potentially better:
 * <pre>
 * var foo = setting.addSetting({ name:'foo', ... });
 * foo.value = 'bar';
 * </pre>
 * <p>Comparison:
 * <ul>
 * <li>The latter version gains by forcing access to the setting to be through
 * the plug-in providing it, so there wouldn't be any hidden dependencies.
 * <li>It's also more compact.
 * <li>It could provide access to to other methods e.g. <tt>foo.reset()</tt>
 * and <tt>foo.onChange(function(val) {...});</tt> (but see SC binding)
 * <li>On the other hand dependencies are so spread out right now that it's
 * probably hard to do this easily. We should move to this in the future.
 * </ul>
 */

define(function(require, exports, module) {

var console = require("util/console");
var types = require("types");
var Event = require("events").Event;

exports.startup = function(data, reason) {
    // TODO add extension point in new style
    // catalog.addExtensionPoint("setting", {
    //     "description":
    //         "A setting is something that the application offers as a way to customize how it works",
    //     "register": "index#addSetting",
    //     "indexOn": "name"
    // });
    // catalog.addExtensionPoint("settingChange", {
    //     "description":
    //         "A settingChange is a way to be notified of changes to a setting"
    // });
    
    // TODO add commands in new style
    // catalog.connect("command", module.id, {
    //     "name": "set",
    //     "params": [
    //         {
    //             "name": "setting",
    //             "type": {
    //                 "name": "selection",
    //                 "pointer": "settings:index#getSettings"
    //             },
    //             "description": "The name of the setting to display or alter",
    //             "defaultValue": null
    //         },
    //         {
    //             "name": "value",
    //             "type": {
    //                 "name": "deferred",
    //                 "pointer": "settings:index#getTypeSpecFromAssignment"
    //             },
    //             "description": "The new value for the chosen setting",
    //             "defaultValue": null
    //         }
    //     ],
    //     "description": "define and show settings",
    //     "pointer": "commands#setCommand"
    // });
    // catalog.connect("command", module.id, {
    //     "name": "unset",
    //     "params": [
    //         {
    //             "name": "setting",
    //             "type": {
    //                 "name": "selection",
    //                 "pointer": "settings:index#getSettings"
    //             },
    //             "description": "The name of the setting to return to defaults"
    //         }
    //     ],
    //     "description": "unset a setting entirely",
    //     "pointer": "commands#unsetCommand"
    // });
};

exports.shutdown = function(data, reason) {
};


/**
 * Something of a hack to allow the set command to give a clearer definition
 * of the type to the command line.
 */
exports.getTypeSpecFromAssignment = function(typeSpec) {
    var assignments = typeSpec.assignments;
    var replacement = 'text';

    if (assignments) {
        // Find the assignment for 'setting' so we can get it's value
        var settingAssignment = null;
        assignments.forEach(function(assignment) {
            if (assignment.param.name === 'setting') {
                settingAssignment = assignment;
            }
        });

        if (settingAssignment) {
            var settingName = settingAssignment.value;
            if (settingName && settingName !== '') {
                var settingExt = settings[settingName];
                if (settingExt) {
                    replacement = settingExt.type;
                }
            }
        }
    }

    return replacement;
};

/**
 * A base class for all the various methods of storing settings.
 * <p>Usage:
 * <pre>
 * // Create manually, or require 'settings' from the container.
 * // This is the manual version:
 * var settings = plugins.catalog.getObject('settings');
 * // Add a new setting
 * settings.addSetting({ name:'foo', ... });
 * // Display the default value
 * alert(settings.get('foo'));
 * // Alter the value, which also publishes the change etc.
 * settings.set('foo', 'bar');
 * // Reset the value to the default
 * settings.resetValue('foo');
 * </pre>
 * @class
 */
exports.MemorySettings = function() {
    /**
     * Storage for the setting values
     */
    this._values = {};
    
    /**
     * Storage for deactivated values
     */
    this._deactivated = {};
    
    this._settings = {};
    
    /**
     * Event that tells people when a setting has changed.
     */
    this.settingChange = new Event({
        keyElement: 0
    });

};

exports.MemorySettings.prototype = {
    /**
     * A Persister is able to store settings. It is an object that defines
     * two functions:
     * loadInitialValues(settings) and persistValue(settings, key, value).
     */
    setPersister: function(persister) {
        this._persister = persister;
        if (persister) {
            persister.loadInitialValues(this);
        }
    },

    /**
     * Read accessor
     */
    get: function(key) {
        return this._values[key];
    },

    /**
     * Override observable.set(key, value) to provide type conversion and
     * validation.
     */
    set: function(key, value) {
        var settingExt = this._settings[key];
        if (!settingExt) {
            // If there is no definition for this setting, then warn the user
            // and store the setting in raw format. If the setting gets defined,
            // the addSetting() function is called which then takes up the
            // here stored setting and calls set() to convert the setting.
            console.warn('Setting not defined: ', key, value);
            this._deactivated[key] = value;
        }
        else if (typeof value == 'string' && settingExt.type == 'string') {
            // no conversion needed
            this._values[key] = value;
        }
        else {
            try {
                var converted = types.fromString(value, settingExt.type);
                inline = true;
                this._values[key] = converted;

                // Inform subscriptions of the change
                this.settingChange(key, converted);
                
            } catch (ex) {
                console.error('Error setting', key, ': ', ex);
            }
        }

        this._persistValue(key, value);
        return this;
    },

    /**
     * Function to add to the list of available settings.
     * <p>Example usage:
     * <pre>
     * var settings = plugins.catalog.getObject('settings');
     * settings.addSetting({
     *     name: 'tabsize', // For use in settings.get('X')
     *     type: 'number',  // To allow value checking.
     *     defaultValue: 4  // Default value for use when none is directly set
     * });
     * </pre>
     * @param {object} settingExt Object containing name/type/defaultValue members.
     */
    addSetting: function(settingExt) {
        if (!settingExt.name) {
            console.error('Setting.name == undefined. Ignoring.', settingExt);
            return;
        }

        if (!settingExt.defaultValue === undefined) {
            console.error('Setting.defaultValue == undefined', settingExt);
        }
        
        var valid = types.isValid(settingExt.defaultValue, settingExt.type);
        try {
            if (!valid) {
                console.warn('!Setting.isValid(Setting.defaultValue)', settingExt);
            }

            // The value can be
            // 1) the value of a setting that is not activated at the moment
            //       OR
            // 2) the defaultValue of the setting.
            var value = this._deactivated[settingExt.name] ||
                    settingExt.defaultValue;

            this._settings[settingExt.name] = settingExt;
            
            // Set the default value up.
            this.set(settingExt.name, value);
        } catch (ex) {
            console.error('Type error ', ex, ' ignoring setting ', settingExt);
        }
    },
    
    removeSetting: function(name) {
        delete this._settings[name];
    },
    
    getSettingNames: function() {
        return Object.keys(settings);
    },
    
    /**
     * Reset the value of the <code>key</code> setting to it's default
     */
    resetValue: function(key) {
        var settingExt = exports.getSetting(key);
        if (settingExt) {
            this.set(key, settingExt.defaultValue);
        } else {
            console.log('ignore resetValue on ', key);
        }
    },

    resetAll: function() {
        this.getSettingNames().forEach(function(key) {
            this.resetValue(key);
        }.bind(this));
    },

    /**
     * Retrieve a list of the known settings and their values
     */
    _list: function() {
        var reply = [];
        this.getSettingNames().forEach(function(setting) {
            reply.push({
                'key': setting,
                'value': this.get(setting)
            });
        }.bind(this));
        return reply;
    },

    /**
     * delegates to the persister. no-op if there's no persister.
     */
    _persistValue: function(key, value) {
        var persister = this._persister;
        if (persister) {
            persister.persistValue(this, key, value);
        }
    },

    /**
     * Delegates to the persister, otherwise sets up the defaults if no
     * persister is available.
     */
    _loadInitialValues: function() {
        var persister = this._persister;
        if (persister) {
            persister.loadInitialValues(this);
        } else {
            this._loadDefaultValues();
        }
    },

    /**
     * Prime the local cache with the defaults.
     */
    _loadDefaultValues: function() {
        return this._loadFromObject(this._defaultValues());
    },

    /**
     * Utility to load settings from an object
     */
    _loadFromObject: function(data) {
        var promises = [];
        // take the promise action out of the loop to avoid closure problems
        var setterFactory = function(keyName) {
            return function(value) {
                this.set(keyName, value);
            };
        };

        for (var key in data) {
            if (data.hasOwnProperty(key)) {
                var valueStr = data[key];
                var settingExt = exports.getSetting(key);
                if (settingExt) {
                    // TODO: We shouldn't just ignore values without a setting
                    var promise = types.fromString(valueStr, settingExt.type);
                    var setter = setterFactory(key);
                    promise.then(setter);
                    promises.push(promise);
                }
            }
        }

        // Promise.group (a.k.a groupPromises) gives you a list of all the data
        // in the grouped promises. We don't want that in case we change how
        // this works with ignored settings (see above).
        // So we do this to hide the list of promise resolutions.
        var replyPromise = new Promise();
        Promise.group(promises).then(function() {
            replyPromise.resolve();
        });
        return replyPromise;
    },

    /**
     * Utility to grab all the settings and export them into an object
     */
    _saveToObject: function() {
        var promises = [];
        var reply = {};

        this.getSettingNames().forEach(function(key) {
            var value = this.get(key);
            var settingExt = exports.getSetting(key);
            if (settingExt) {
                // TODO: We shouldn't just ignore values without a setting
                reply[key] = types.toString(value, settingExt.type);
            }
        }.bind(this));
        
        return reply;
    },

    /**
     * The default initial settings
     */
    _defaultValues: function() {
        var defaultValues = {};
        this.getSettingNames.forEach(function(settingName) {
            var settingExt = exports.getSetting(settingName);
            defaultValues[settingExt.name] = settingExt.defaultValue;
        });
        return defaultValues;
    }
};

exports.settings = new exports.MemorySettings();

});
