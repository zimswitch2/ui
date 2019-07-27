Usage
=====

The following grunt tasks are available:

$> grunt redact:everythingOn
   Redacts with all release and development toggles turned on. This is used for running unit tests.


$> grunt redact:releaseToggles
   Redacts release toggles and development toggles according to command line options.
   By default, all release toggles are on unless property "ready" is set to false and development toggles take their default value.
   Available command line options:

--no-routing-rules
   Turns off routingForAllowedFrom toggle

--release=<release_name>
   Turns on release toggles targeting releases up to the specified release

--toggle=<toggle_name>
   Turns off all but the specified toggle



How it works
============

There are 3 relevant files:

releases.json
   -- has planned releases with dates. Should only have release currently in production and later ones.

releaseToggles.json
   -- has release toggles with their target release name and optional ready indicator. All toggles targeting older releases should be removed.

developmentToggles.json
   -- has toggles used only for development with default value and grunt option to override it.
