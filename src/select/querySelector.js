import { rescape, rpseudoUpperkeys, rsibling } from "../regex";
import push from "../vars/_push";
import slice from "../vars/_slice";
import core from "../core";
import validateAttribute from "../validate/validateAttribute";

export default function( context, selector ) {
	let results        = [],
		newSelector,
		oldId,
		newId,
		newContext     = context,
		changeSelector = context.nodeType === 1 && context.nodeName.toLowerCase() !== 'object';

	if( !selector ) {
		return [];
	}

	selector = validateAttribute( selector ).replace( rpseudoUpperkeys, ( x ) => x.toLowerCase() );

	newSelector = context.nodeType === 9 && selector;

	try {
		if( changeSelector ) {
			newId = core.expando;
			if( ( oldId = context.getAttribute( 'id' ) ) ) {
				newId = oldId.replace( rescape, '\\$&' );
			} else {
				context.setAttribute( 'id', newId );
			}
			newId       = '[id=\'' + newId + '\'] ';
			newContext  = rsibling.test( selector ) && context.parentNode || context;
			newSelector = newId + selector;

			newSelector = newSelector.replace( /\\,/gi, '__TEMP_SEEK__' );
			newSelector = newSelector.endsWith( ',' ) ? newSelector.substring( 0, newSelector.length - 1 ) : newSelector;
			if( newSelector.indexOf( ',' ) > 0 ) {
				newSelector = newSelector.replace( /,/gi, ', ' + newId );
			}
			newSelector = newSelector.replace( /__TEMP_SEEK__/gi, '\\,' );
		}

		if( newContext && newContext.querySelectorAll ) {
			push.apply( results, slice.call( newContext.querySelectorAll( ( newSelector ? newSelector : selector ).replace( /_COMMA_/g, ',' ) ), 0 ) );
		}
		return results;
	} catch( err ) {
		throw new Error( 'Syntax error, unrecognized expression: \n ' + err.message + ' ' + selector + ' ' + newSelector );
	} finally {
		if( changeSelector && !oldId ) {
			context.removeAttribute( 'id' );
		}
	}
}