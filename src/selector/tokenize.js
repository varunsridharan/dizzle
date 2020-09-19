import parse from "../parser/parse";
import { stringifyToken } from "../parser/stringify";
import isString from "../typechecking/isString";
import isPlainObject from "../typechecking/isPlainObject";
import { BrowserSupportedPseudo, BrowserSupportedOperators, Traversals } from "../vars";
import core from "../core";

/**
 * Converts CSS Pasred Object into queryable Data.
 * @param selector
 * @return {*[][]}
 */
export default function( selector ) {
	return parse( selector ).map( ( tokens ) => {
		const renderedSelectors = [];
		let selector            = [];
		const store             = ( data ) => {
			if( isString( data ) ) {
				selector.push( data );
			} else if( isPlainObject( data ) ) {
				renderedSelectors.push( selector.join( '' ) );
				renderedSelectors.push( data );
				selector = [];
			}
		};


		tokens.map( token => {
			let { type, name, action } = token;
			if( 'tag' === type ) {
				store( name );
			} else if( 'descendant' === type ) {
				store( ' ' );
			} else if( 'attr' === type ) {
				if( 'id' === name || 'class' === name && 'element' === action ) {
					let element_type = ( 'id' === name ) ? '#' : '.';
					store( element_type );
					store( token.val );
				} else if( BrowserSupportedOperators.indexOf( action ) >= 0 ) {
					store( stringifyToken( token ) );
				} else {
					store( token );
				}
			} else if( Traversals.indexOf( type ) >= 0 ) {
				selector.push( ` ${type} ` );
			} else if( 'pseudo' === type ) {
				store( token );
			}
		} );

		renderedSelectors.push( selector.join( '' ) );
		return renderedSelectors.filter( value => ( '' !== value ) );
	} );
}