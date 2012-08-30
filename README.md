*  Re-usable modules
    *  smallest units of 'real work' - i.e. carousel pagination
*  Decoupled module dependencies
*  Re-usable components
    *  groups of modules - i.e. carousel + pagination + filters
*  Per component config, per module config
*  Page level component mediator
*  Removal of pub/sub pattern in favour of direct method calls
    *  Components should not have ability to talk directly
    *  Contact between modules should be minimized by using a mediator
    *  Increases code robustness
    *  Decreases maintenance cost
*  Removal of MVC pattern in favour of Mediator/Facade/Module
    *  Allows for more modular codebase
    *  Conceptually similar to JavaScript
*  Minimized require dependencies
*  Minimized race condition gaps