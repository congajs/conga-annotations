'use strict'

const Registry = require('../lib/registry')
const Reader = require('../lib/reader')

const registry = new Registry()
const reader = new Reader(registry)
const samplePath = __dirname + '/data/sampleES6.js'

// register all of our test annotations
registry.registerAnnotation(__dirname + '/annotations/my-class.js')
registry.registerAnnotation(__dirname + '/annotations/my-constructor.js')
registry.registerAnnotation(__dirname + '/annotations/my-method.js')
registry.registerAnnotation(__dirname + '/annotations/my-property.js')
registry.registerAnnotation(__dirname + '/annotations/namespace-property.js')
registry.registerAnnotation(__dirname + '/annotations/nested.js')

reader.parse(samplePath)

const definitionAnnotations = reader.definitionAnnotations
const constructorAnnotations = reader.constructorAnnotations
const methodAnnotations = reader.methodAnnotations
const propertyAnnotations = reader.propertyAnnotations

console.log('Definition : ')
definitionAnnotations.forEach((annotation) => {
  console.log(annotation)
})
console.log('\nConstructor : ')
constructorAnnotations.forEach((annotation) => {
  console.log(annotation)
})
console.log('\nMethods : ')
methodAnnotations.forEach((annotation) => {
  console.log(annotation)
})
console.log('\nProperties : ')
propertyAnnotations.forEach((annotation) => {
  console.log(annotation)
})
