Changelog
---------

0.1.0
=====

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