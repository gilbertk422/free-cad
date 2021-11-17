#### List of global variables
1. **app** - Container.js
2. **container** - Container.js
4. **Popup, DialogPopup, DraggablePopup** - popup.js (need remove from global scope)
5. **Helper** - Container.js
6. **Exception** - Container.js

---
popup.js and function.1.0.js - most be removed

---
The project has environment variables. The default values define in the webpack.config.json file.  
You can override the variables in the ./.env file. 

All the environment variables are global.


---
Structure of data file [*.emsx](./asset/example.emsx) is in the  [data_structure.dtd](./asset/format.dtd) file.



---
_The design was carried out in the program [StarUML](http://staruml.io/) ,
the actual project file can be found [here](./asset/UML project.mdj)_

Copyright (c) 2019 Micro Logic Corp.


1. Общая структура проекта 
    
    Проект состоит из набора модулей. Связь меджу модулями осувществляется с помощю IOC container`a. 
    Исходя из этого базового принципа построения архитектуры, следует что управлением созданием объектов занимается 
    контейнер. Для того что бы добавить реализацию какого-то класса в проект небходимо, в коде загрузки модуля добовить следующий код. 
    ~~~
    container.register(<alias of class>, <reference to class>)
    Ex: container.register('model.line', Line)
    ~~~
    В дальнейшем для получения екземпляров объектов зарегистрированого класса необходимо выполнить такой код
    ~~~
    container.resolve(<alias of class>, [<list of constructor attributes>])
    ~~~
    Объекты классов другого модуля можно создавать только таким образом. 
    Такой подход позволяет уменьшит зависимости межд модулями, и легко заменять реализации классов во время тестирования,
    разделить код на независимые части во время загрузки приложения, подгружать только необходимые модули и т.д.
    
    Приложение состоит из нескольких базовых частей.
    1. Container - глобальный объект который инициализируется первым во время загрузки приложения, и с помощью которого
    происходит инициализация и связь между остальними частями приложения.
    2. modules - модулем считается набор исходных кодов, находящихся одной дериктории, имеющей файл index.js в котором 
    описан список классов, методов и происходит реестрация реализаций этих классов в container. 
    
    
    