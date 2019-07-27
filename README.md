# IBR (Internet Banking Refresh)

---

## Document Outline
- [Tasks](#tasks)
- [The Architecture](#the-architecture)
- [Resources](#resources)
- [Glossary](#glossary)


---


<a name="tasks"></a>

## Tasks

### Set up
$ `npm install -g grunt-cli`

$ `cd ui`

$ `npm install`

### Run unit and acceptance tests
$ `grunt`

### Build, watch & run local web server
### Ensure pacto is running first - Checkout ibr-contracts project, run 'bundle exec rake server'
$ `grunt develop`

### Package
$ `grunt package`

### Unit Tests
$ `grunt test:unit`

### All Acceptance Tests
$ `grunt acceptance`

### Single Acceptance Test
Update the tests you want to run by renaming the appropriate `describe` statements to `fdescribe` (note the 'f') in the spec file you want to test.

Additionally, you can rename the `it` test statement to `fit` to run only that test.

$ `grunt acceptance:debug`

This will run only the tests you have `ddescribe`'d.

### Single Cucumber Feature

$ `grunt acceptance:cucumber --specs=src/test/functional/acceptance/targetedOffers/investmentsTargetedOffers.feature`

This will run only this feature.


---


<a name="the-architecture"></a>

## The Architecture

### Birdseye View

```no-highlight
                  +--------------------+
                  |    Front-end [1]   |
                  +----------A---------+
                             |
                             |
              +--------------+-------------+
              |                            |
    +---------V---------+      +-----------V---------+
    |  Gateway API [3]  <------>  Contracts API [2]  |
    +---------+---------+      +---------------------+
              |   |_________________________
              |                            |
    +---------V---------+      +-----------V---------+
    |       MCA [4]     <------+        Meniga       |
    +---------+---------+      +-----------A---------+
              |                            |
--------------|----------------------------|--------------
              |                            |
    +---------V---------+      +---------------------+
    |       ESB [5]     |      |          EIW        |
    +---------+---------+      +---------------------+
              |                            |
              |-----------------------------
              V
      Here be Dragons [6]
     SAP, Mainframe, CPS, etc.
             
```

## 1. Front-end

### Architecture

### Build Tooling
- Grunt used as a build runner.
- Redact
**NB** Comments will be stripped out of any Javascript source files


## 2. Contracts API (aka Pacto, Stubs)
- Done vs Daily vs Pending
    **Done** = ???
    **Daily** = ???
    **Pending** = ???
- ???


## 3. Gateway API
- Exposes a REST API which the front-end
- ???

## 4. MCA
- Communicates with the external services
- ???

## 5. ESB
- ???

## 6. TODO Could someone flesh this out a bit?
- ???


---


<a name="resources"></a>

## Resources

### Online Services

**Build Monitoring**
http://dchop174.standardbank.co.za/index

**Repos**
[Stash](http://stash.standardbank.co.za:7990/projects/IBR) (Front-end, Contracts API)
[SVN](https://svn.standardbank.co.za:449/svn/mca/channel/ib/gateways/sbg-gateway-ib) (Gateway API, MCA)

**Collaboration**
[Confluence](http://confluence.standardbank.co.za:8060/)
[Jira](http://jira.standardbank.co.za:8091/)

**Build Versions View**
[Link](http://10.18.16.20:8000/versions.html)


---


<a name="glossary"></a>

## Glossary

**IBR**
Internet Banking Refresh

**BBD**
Business Banking Digitisation

**MCA**
Multi Channel Architecture

**MCAF**
Multi Channel Architecture Framework

**Toggles**

**ESB**
Enterprise Service Bus

**RCA**


