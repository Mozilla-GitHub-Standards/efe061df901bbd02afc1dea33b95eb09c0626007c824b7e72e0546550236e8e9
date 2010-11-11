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

