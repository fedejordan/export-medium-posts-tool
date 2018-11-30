* * *

# SimpleRTApp: Uso de APN para enviar pushes a iOS desde NodeJS

Este artículo es parte de una serie que intenta crear una aplicación que muestre tweets de interés para el usuario. Pueden ver la guía con la lista principal [acá](https://medium.com/@federicojordn/c%C3%B3mo-obtener-twitts-relevantes-en-una-app-de-ios-con-heroku-nodejs-swift-4c4aca1f42b2).

En esta ocasión vamos a ver como mandar push notifications desde Node.js a un dispostivo iOS. Para ello, vamos a usar el paquete `apn`.

#### Requisitos

Para poder seguir con el tutorial, es necesario disponer de lo siguiente:

*   un dispositivo iOS, ya que las push notifications no funcionan en simulador
*   una cuenta de _Apple Developer Program Membership_. Si bien sin una cuenta de desarrollador de Apple se puede compilar en el dispositivo, para poder configurar las push notifications si es necesario disponer de una, ya que se necesitará crear un _Push Notification Certificate_.

#### Apple Push Notification Service

_Apple Push Notification service_ (APNs) es la pieza central en la funcionalidad de notificaciones remotas. Es un servicio robusto, seguro y muy eficiente que permite a desarrolladores propagar información a iOS (como tambíen indirectamente a watchOS), tvOS, y dispositivos macOS.

Cuando una aplicación iOS se inicia en un dispositivo, el sistema automáticamente establece una acreditada, encriptada y persistente conexión IP entre la app y APNs. Esta conexión permite a la app configurar y habilitar al dispositivo para recibir notificaciones. Esto está explicado en más detalla en [Configuring Remote Notification Support](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/HandlingRemoteNotifications.html#//apple_ref/doc/uid/TP40008194-CH6-SW1).

La otra parte de la conexión para enviar notificaciones (el persistente y seguro canal entre un servidor proveedor y APNs) requiere configuración en [la cuenta de desarrollador](https://developer.apple.com/account) y el uso de certificados provistos por Apple. El proveedor es un servidor, que el desarrollador implementa y gestiona, para trabajar con APNs.

![](https://cdn-images-1.medium.com/max/1600/0*JPCUlkVRVTMUvSSv.png)Entregando una notificación desde un servidor a un dispositivo

Más información sobre APNs en [la documentación oficial de Apple](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html).

#### Acerca del paquete apn

Para poder comunicarnos con APNs vamos a necesitar realizar todas las conexiones y configuraciones necesarias desde Node.js. Para ello, disponemos del paquete `apn` , que es un módulo de Node.js para facilitar el envío de notificaciones vía APN service. Esta listo para usar en producción e incluye funcionalidades que hacen más facil a los desarrolladores implementar notificaciones rápidamente. Entre sus características se destacan:

*   Esta basado en una API de proveedor en HTTP/2
*   Mantiene una conexión con el servidor para maximizar el procesamiento y envío de notificaciones
*   Envía automáticamente notificaciones no envíadas si ocurrió un error.

Pueden ver el repo oficial en este link: [https://github.com/node-apn/node-apn](https://github.com/node-apn/node-apn)

### Creacion de certificados

Para poder enviar notificaciones desde nuestro servidor, necesitamos indicar a APN que tenemos permisos de hacerlo para nuestra app. Es por eso que necesitamos crear un certificado SSL para establecer una conexión segura con APNs. Tendremos que realizar lo siguiente:

1.  Desde Xcode, vamos a nuestro proyecto y seleccionando el Target, vamos a la pestaña de Capabilities. Ahi mismo, habilitamos el switch que dice Push notifications. Esperamos un poco a que se realice la configuración automática.

![](https://cdn-images-1.medium.com/max/1600/1*TALMHVU7LfHO4mf2LAXKWw.png)

2\. Una vez habilitado, vamos al [Developer Center,](https://developer.apple.com/account) ingresamos nuestra cuenta, Certificates, Identifiers & Profiles, Identifiers, App IDs y buscamos nuestra app (en nuestro caso, SimpleRTApp). Vamos a Edit.

3\. En esta pantalla, vamos a la parte de Push Notifications, y donde dice Development SSL Certificate, vamos a Create Certificate…

![](https://cdn-images-1.medium.com/max/1600/1*72uOFsVWuGkTGa75dq7UWw.png)

Ahi mismo nos dice los pasos que debemos realizar, pero igualmente voy a transcribirlos aca para que les sea más facil.

4\. Abrimos la aplicación Keychain Access en nuestra Mac, y hacemos click en el menú Keychain Access -> Certificate Assistant -> Request a Certificate from a Certificate Authority. Ahi mismo le damos a Se guarda en disco, y guardamos en un lugar seguro el archivo “CertificateSigningRequest.certSigningRequest”.

5\. Habiendo creado este archivo, volvemos a la página de Developer Center, y le damos a Continuar. Seleccionamos el archivo `.certSigningRequest` y hacemos click en Continuar nuevamente. Deberíamos estar en la siguiente pantalla:

![](https://cdn-images-1.medium.com/max/1600/1*SweXhfNVtDEQFuxCgAiuKA.png)

Ya tenemos listo nuestro archivo `aps_development.cer` para descargar.

6\. Desde el Finder, le damos doble click al archivo descargado y vemos como se nos abre la app de Keychain Access, con el certificado ya agregado a la lista. Seleccionamos de la lista el certificado y la clave privada, para exportar un archivo P12:

![](https://cdn-images-1.medium.com/max/1600/1*QJPLVDR_SgRPLwg48EP7CA.png)

Nos aseguramos de que exportemos como archivo P12, nos va a pedir una contraseña, escribimos una y guardamos el archivo en disco.

![](https://cdn-images-1.medium.com/max/1600/1*NzVBM2kXbK39xJWOCirTkQ.png)

Con esto ya generamos el archivo P12 necesario para poder realizar la comunicación segura entre nuestro server y APNs.

Es importante no olvidar la contraseña, ya que es requerida por Apple para poder enviar push notifications.

### Obtener device token en iOS

Para poder testear nuestras notificaciones, vamos a necesitar un device token de algun dispositivo.

Podemos encontrar facilmente el nuestro, simplemente solicitando permisos de push notificaciones en nuestra app SimpleRTApp. Para ello, agregamos los siguientes métodos en nuestro `AppDelegate.swift` :

<iframe width="700" height="250" src="/media/0968a6886f2d86025ed6c86e826ecd00?postId=fa5dbe91bb4e" data-media-id="0968a6886f2d86025ed6c86e826ecd00" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Favatars0.githubusercontent.com%2Fu%2F5657224%3Fs%3D400%26v%3D4&amp;key=a19fcc184b9711e1b4764040d3dc5c07" allowfullscreen="" frameborder="0"></iframe>

A destacar:

*   Mediante el SDK de `UserNotifications`, hacemos `UNUserNotificationCenter.current().requestAuthorization()` para pedirle permisos al usuario.
*   Una vez que obtuvimos los permisos, registramos mediante `UIApplication.shared.registerForRemoteNotifications()`
*   Si la app pudo registrarse correctamente, se va a llamar a `application(_ application: UIApplication, didRegisterForRemoteNotificationsWithDeviceToken deviceToken: Data)`, en el cual imprimiremos en consola el valor del device token.

Con esta implementación, la app ya estará lista para recibir push notifications y obtendremos el device token de prueba para usar desde el server.

Pueden ver el código final de la app iOS en [https://github.com/fedejordan/SimpleRTApp](https://github.com/fedejordan/SimpleRTApp), tag `push_notifications_setup`

### Creacion de script en Node.js

Con lo anterior, obtuvimos entonces:

*   El archivo p12, que nos servirá para poder conectarnos de forma segura con APNs
*   El device token, que nos servirá para enviar push notifications a ese dispositivo físico

Por lo que ya estamos listos para crear nuestro programa en Node.js para que envíe push notifications:

1.  Vamos a la app de Terminal y hacemos `npm install apn`. Esto nos instalará la biblioteca encargada de manejar todos los temas relacionados con la conexión a APNs.
2.  Copiamos el archivo p12 (en mi caso se llama `simpleapprt-certificates.p12`) a la misma carpeta de nuestro script en Node.js
3.  Creamos el script con el siguiente contenido:

<iframe width="700" height="250" src="/media/d1b7ba9fc56671f92b75f5d87aa4437c?postId=fa5dbe91bb4e" data-media-id="d1b7ba9fc56671f92b75f5d87aa4437c" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Favatars0.githubusercontent.com%2Fu%2F5657224%3Fs%3D400%26v%3D4&amp;key=a19fcc184b9711e1b4764040d3dc5c07" allowfullscreen="" frameborder="0"></iframe>

Donde reemplazaremos `<device-token>` y `<p12-password>` por nuestro propio device token y la contraseña que habiamos puesto en el archivo p12 respectivamente.

Básicamente en el script seteamos las opciones para establecer la conexión (en nuestro caso va a ser con certificados, por eso seteamos la ruta de nuestro archivo p12 y el passphrase), instanciamos el objeto `Provider`, creamos el objeto de tipo `Notification` y lo enviamos a través del método `send()`. Cuando obtenemos la respuesta (ya sea error o no), finalizamos la ejecución.

Para probar todo esto vamos a la terminal, hacemos `node send_push.js` y esperamos a que la push llegue a nuestro celular:

![](https://cdn-images-1.medium.com/max/1600/1*lL_11PIlKWDvvbL0Q4B8NQ.png)

¡Felicidades! Ya hicimos llegar nuestra primera push notification a un dispositivo iOS :)

Pueden ver el script finalmente creado en [https://github.com/fedejordan/SimpleRTAppAPI,](https://github.com/fedejordan/SimpleRTAppAPI) tag `send_push_script`.

### Uso de custom actions

Para nuestro proyecto SimpleRTApp, dijimos que queriamos tener la opcion de retuitear desde la push notification. Esto lo podemos hacer posible enviando también la información para que se muestre una custom action

¿Qué es una custom action? Son acciones que el usuario tiene disponible para hacer en una determinada push notification. En nuestro caso vamos a enviar una acción con el nombre “Retuitear”.

Para hacerlo, vamos a tener que enviar más información en la push notification. A nuestro script `send_push.js` agregamos entonces lo siguiente cuando seteamos el objeto `notification` :

<pre name="6295" id="6295" class="graf graf--pre graf-after--p">notification.category = “RETWEET”;</pre>

De esta forma indicamos que queremos que se muestre un custom action con el category Id `RETWEET`.

Para poder mostrar la acción en la push notification, tenemos que indicárselo a la app iOS que es una acción permitida. Vamos a tener que registrar la acción de esta forma:

<pre name="6575" id="6575" class="graf graf--pre graf-after--p">let retweetAction = UNNotificationAction(identifier: “retweet_action_identifier”, title: “Retweet”, options: [.foreground])

 let retweetCategory = UNNotificationCategory(identifier: “RETWEET”, actions: [retweetAction], intentIdentifiers: [], options: [])

 UNUserNotificationCenter.current().setNotificationCategories([retweetCategory])</pre>

Instanciamos un `UNNotificationAction` llamado `retweetAction`, elcual nos servirá más adelante para saber que hacer si el usuario tocó la acción. Esta acción la tenemos que asociar a un tipo `UNNotificationCategory`, el cual tendrá un identifier que tiene que coincidir con el que enviamos desde el server. Por último, le indicamos a `UNUserNotificationCenter` las categorías que son permitidas por las pushes (pueden ser más de una).

El código en la app iOS nos quedaría de la siguiente forma, para nuestro `AppDelegate.swift`:

<iframe width="700" height="250" src="/media/8c94734fbb9da986ed06ffc823536138?postId=fa5dbe91bb4e" data-media-id="8c94734fbb9da986ed06ffc823536138" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Favatars0.githubusercontent.com%2Fu%2F5657224%3Fs%3D400%26v%3D4&amp;key=a19fcc184b9711e1b4764040d3dc5c07" allowfullscreen="" frameborder="0"></iframe>

Hacemos `node send_push.js` en la terminal y comprobamos si se envía una push con una custom action:

![](https://cdn-images-1.medium.com/max/1600/1*W-7-SXbskN2VPXwDwmyIsQ.jpeg)

Con esto, logramos enviar custom actions en nuestras push notifications :)

Pueden ver el código final de la app iOS en [https://github.com/fedejordan/SimpleRTApp,](https://github.com/fedejordan/SimpleRTAppAPI) tag `apn_custom_actions`.

### Conclusiones

El post se me hizo un poco largo, pero hicimos todo el setup necesario para enviar push notifications desde una app en Node.js y la configuración que se necesita en la app iOS, así como tambien todo lo necesario para generar los certificados con el APN server.

En el siguiente post voy a ordenar un poco este código (tanto server como iOS), y realizar finalmente el script que permita recorrer los device tokens, realizar el request de los tweets, y enviar push notifications. Además, voy a implementar la lógica en la app iOS para poder retuitear si el usuario hace tap en la acción de la push.

¡Gracias por leer! Cualquier comentario, sugerencia pueden enviarlo a fedejordan99@gmail.com

### Fuentes

*   [https://github.com/node-apn/node-apn](https://github.com/node-apn/node-apn)
*   [https://www.raywenderlich.com/156966/push-notifications-tutorial-getting-started](https://www.raywenderlich.com/156966/push-notifications-tutorial-getting-started)
*   [https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html](https://developer.apple.com/library/content/documentation/NetworkingInternet/Conceptual/RemoteNotificationsPG/APNSOverview.html)