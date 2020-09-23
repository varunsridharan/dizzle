# Dizzle
~ Simple Fast CSS Selector Engine ~

## What?
___Dizzle___ turns CSS selectors into functions that tests if elements match them. When searching for elements, testing is executed "from the top", similar to how browsers execute CSS selectors.

## Features:
* Full implementation of CSS3 selectors
* Partial implementation of jQuery/Sizzle extensions
* Very high test coverage
* Pretty good performance


## Why?
> Moving Out of jQuery & Using [PickledVanilla] has triggered me to create a library like this.

## Supported Selectors
| Combinators | Attributes | Pseudo |
| :---: | :---: | :---: |
| `>` Child | | |
| `+` Adjacent | | |
| `~` General Sibling | | | 
| ` ` Descendant | | |


## Combinators

### Child `>`
The child selector selects all elements that are the children of a specified element.

### Adjacent `+`
The adjacent sibling selector selects all elements that are the adjacent siblings of a specified element.

### Sibling `~`
The general sibling selector selects all elements that are siblings of a specified element.

### Descendant ` `
The descendant selector matches all elements that are descendants of a specified element.


[PickledVanilla]: https://github.com/wponion/PickledVanilla