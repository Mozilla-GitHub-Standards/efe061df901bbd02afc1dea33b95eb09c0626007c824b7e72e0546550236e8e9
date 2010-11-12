# Skywriter 1.0 Spec #

## Introduction ##

The Bespin project has shifted focus based on our needs within Mozilla and 
things that we've learned. From the perspective of the Mozilla
Developer Tools group, what we really need out of the project today is a
powerful, user-friendly, customizable code editor component. This is 
what we've been building with our Bespin Embedded packages.

As of a few months ago, we still intended to create Desktop and Server
versions of the editor. However, our need for those is less important to
us than our need for great developer tools.

Looking forward as Bespin matures from the Bespin project to 
Mozilla Skywriter 1.0, we have this narrowed focus. This gives us leeway
to greatly simplify things based on what we've learned and the new goals.
Additionally, we have found that we have similar goals for Skywriter as
Ajax.org does for the ACE editor component and that Ajax.org's Cloud9
IDE has a lot in common with what we wanted to see the Bespin server become.

At the high level, our plan is to merge Mozilla Skywriter and ACE. Skywriter
1.0 will be based on this merged codebase. This document is here to collect
up notes about how this merger will work and what the end product will look
like.

## Source Repositories ##

As of this writing, our source repositories are in a bit of a funny state.
We've done a good deal of work creating a new plugin structure and altering
Skywriter plugins to fit this structure. That work is in a "shared"
repository that we had created originally to hold code shared between the 
projects. That repository is here:

https://github.com/mozilla/cloud9-skywriter-shared

Right now, that repository includes its own copy of ACE, right in that
repository. This will need to change.

The authoritative repository for ACE is here:

https://github.com/ajaxorg/ace

The authoritative repository for Skywriter is here:

https://github.com/mozilla/skywriter

At present, the Skywriter repository doesn't have much that has migrated
forward toward 1.0.

In the immediate term, Mozilla will create a fork of the ACE repository.
The Skywriter repository will have this fork as a submodule. The code
in the shared repository will either move into the ACE repository or the
Skywriter repository, depending on whether it's likely to be useful
to ACE/Cloud9.

Once Ajax.org is ready to move over to the updated-with-new-plugin-system ACE,
the submodule in Skywriter will change to point to the authoritative ACE
repository.

## Plugin System ##

Bespin 0.9 is built around and driven by a plugin system. ACE has a tiny bit
of a plugin capability. The plan for Skywriter 1.0 is to be plugin-driven but
to have a far simpler plugin model.

When Bespin's plugins were introduced, we did so with the thought that we 
would have a Bespin server potentially with a great many plugins. In order to
make load times reasonable, we would lazy load plugins on demand as much as
was possible. In order to make lazy loading possible, plugins needed to have
a bunch of metadata that described what they offered to the system. As an
example of this, if you made a command to reformat a document when you press
ctrl-K, that plugin would not be sent along to the client until the user
actually presses ctrl-K.

That lazy loading made the plugin system and the plugins themselves more
complex and less JavaScripty.

Skywriter throws out the lazy loading requirement, though we may bring it
back in limited cases in the future for things like syntax highlighters.
This simplifies the plugin system and many plugins.

As with Bespin 0.9, plugins are [CommonJS packages](http://wiki.commonjs.org/wiki/Packages/1.0).
However, the notion of "extension points" that was so important in Bespin 0.9
is being replaced by the more common idiom of calling registration functions
to tell the editor about new functionality. The common extension points from
Bespin 0.9 will have a straightforward conversion to a registration function
call.

The plugin's main module (generally called "index.js") can have functions
defined on it that are called at various points in the plugin's lifecycle.
The function names and the plugin lifecycle are the same as defined in
Firefox's [Bootstrapped Extensions](https://developer.mozilla.org/en/Extensions/Bootstrapped_extensions).
There is no relationship between Skywriter plugins and Firefox extensions, but
the interface described on that page matches exactly what we need.

