Changelog
=========

0.1.4
-----

December 28, 2013

  * Added check to make sure constructor annotation exists in reader.js

0.1.3
-----

July 24, 2013

  * Re-worked attribute parsing so that arrays of nested annotations are handled correctly.

0.1.2
-----

July 19, 2013

  * Added ability to have nested annotations.

0.1.1
-----

July 13, 2013

  * Added optional init() method to annotations so that incoming data can be transformed
    if needed.


0.1.0
-----

July 13, 2013

  * Changed annotation creation so that registered annotations now need to extend 
    the Annotation class by calling Annotation.extend() which simplifies annotation
    creation by requiring less code to implement.

  * Added "annotation" property to annotation instances so that annotations can
    be compared using:

    if (annotation.annotation === 'MyAnnotation') {
        // ...
    }

    This removes the need to include the annotation class and do "instanceof" checks

  * Changed default value property name to 'value' instead of '__value' so that
    annotation.value is always available automatically