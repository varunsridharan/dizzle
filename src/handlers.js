const handlers = {};

handlers.tag = ( tagName, dom ) => dom.getElementsByTagName( tagName );

export default handlers;