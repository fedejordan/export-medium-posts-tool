
# SimpleRTApp: API REST usage on Swift with Alamofire+Codable

This article is part of a series that aims to build a system to send notifications of relevant articles of Twitter, with the purpose of being easily retweeted. Here is the complete article.

We’re going to build the needed networking layer in the iOS app to consume our Rest API, [created before.](https://medium.com/@federicojordn/simplertapp-basic-structure-of-a-node-js-api-rest-a805a30a0466) To do that, we’ll use two tools: Alamofire and Codable protocol, from Apple

### Requirements

It’s mandatory to have Swift language knowledge and iOS development basic tools. Also, we need to know the REST protocol to consume the APIs.

### About Alamofire and Codable

[Alamofire](https://github.com/Alamofire/Alamofire) is a library created by [@matt with](https://twitter.com/mattt) the purpose of easily integrate an iOS app with HTTP services. It’s built on Swift and it’s the most used library in the platform.

We choose it because its extensive usage by community, its rating on Github (actually it has a bit more than 29000 stars) and its adaptability to different needs, and its update frequency.

The other library, [Codable,](https://developer.apple.com/documentation/swift/codable) is a Apple native tool to allow that our data types be encodables or decodables, to be compatible with external data, like JSON structures.

## Builiding our first request

We’re going to see the steps to build a basic networking layer for any application. It’s important to keep in mind that we always can go further with the concept, so for this article we’ll prioritize to explain the library behavior and have a functional networking layer.

*It’s important that we disable Transport Security in our Info.plist, because we’re not going to use secure connections (other than HTTPS) by now. [More info here](https://stackoverflow.com/questions/31254725/transport-security-has-blocked-a-cleartext-http).*

Having a Xcode project created, we proceed with the stepts to integrate Alamofire:

1. We install Alamofire adding in our Podfile pod 'Alamofire', '~> 4.7', , later we proceed to do pod install in terminal.

1. We open the workspace file and create a file TweetRequest.swift with the following content:

<iframe src="https://medium.com/media/d5219716595a8049de5e990c077f3994" frameborder=0></iframe>

This will be the object that we’ll obtain from our request. Using the Codable protocol and specifying each CodingKey we can set which JSON fields we want to obtaing for each variable.

3. We create a class called NetworkManager, which will have the following content:

<iframe src="https://medium.com/media/25717be81111b54b185b83bca98d0a46" frameborder=0></iframe>

In this case, we define a method called getTweetRequest(byId id: String, completion: (TweetRequest?) -> Void) , which will do the corresponding request to our local environment localhost and, if that TweetRequest for that id is available, we’ll obtain its data. In another case, the method will call the completionblock with the nil value.

4. Just for testing, we’re going to do a request in ApplicationDelegate.swift in the didFinishLaunching method in as follows:

    let networkManager = NetworkManager()
    networkManager.getTweetRequest(byId: “4”) { (tweetRequest) in
        print(tweetRequest)
    }

This should print to us the following log in our console:

    Optional(SimpleRTApp.TweetRequest(tweetRequestId: Optional(4), deviceToken: Optional(“ExampleDeviceToken”), hashtags: Optional(“#Example #hashtags”)))

With that we’ve just created our first GET request with Alamofire y Codable :)

## Full networking layer for SimpleRTApp

With the previous steps, we’ve the GET /tweetRequest/:id which will allow us to see the current hashtags for the user. We still need then, to create the requests for the following endpoints:

* POST /tweetRequest to indicate the backend which hashtags we want to be notified.

* DELETE /tweetRequest/:id to delete the notifications for certain hashtags

* POST /postwedTweet to tell the backend which tweet was posted (and it doesn’t suggest later)

We sort out a little the endpoints and the needed parameters, our NetworkManager class can be something like that:

<iframe src="https://medium.com/media/061f141529f0e06b133d6fa38dd718bf" frameborder=0></iframe>

Some highlights:

* We added a NetworkPath enum which we obtain the complete URL to each path that we can use. In that way, we have just one place where are all the URLs. Something that we could do is to include and replace the id (the one from TweetRequest or PostedTweet) but I decided to do it simple by now.

* We added a NetworkParameter struct where we would have all the used parameters for any request. We could also use an enum, and in some way constraint the parameters that we can accept (doing some magic so we can use just a value from that enum), but again, I decided to maintain that simple too.

* Like the other methods aren’t GET types, which is the default method, we need to clarify in the method parameter from Alamofire.request. We also clarify that these are .post and also .delete.

* In the case of POST requests, they need to have the required parameters (the request body). We do this specifying a dictionary of [String: Any] to the parameter parameters of Alamofire.request.

* Finally, because the missing requests don’t give us a response, we simply inform the result ofresponse.result.isSuccess in the completion, in case we need to take an action if the request failed.

Although we do not require it, we can also create the PostedTweet struct, the another model that we use in our database:

<iframe src="https://medium.com/media/6060f8c97ffd1887c38cae1d09da0a84" frameborder=0></iframe>

It will be our task to carry out the proper implementation of these requests. You can see the final code in [https://github.com/fedejordan/SimpleRTApp](https://github.com/fedejordan/SimpleRTApp), tag basic_networking.

It’s important to say that the server should be listening in our local machine (node server.js at terminal). [More info here](https://medium.com/@federicojordn/simplertapp-basic-structure-of-a-node-js-api-rest-a805a30a0466).

### Improvements

Our networking layer can be improvedNuestra capa de networking básica se puede mejorar substantially. First, coupling all the request in just one class is not scalable, a better approach could be to have classes for each request type and have them already defined in their init method, specifying which parameters accepts. In that way, if our request changes we just have to modify the parameters for this class.

Also, if we want to test our implementation we should mock the responses in some way. At the moment, it’s not possible with the current solution, at least we encapsulate the calls in some protocol, for example.

I’ll submit another article with a more complete networking layer implementation, more scalable and testable. In this article I just wanted to cover the basic usage of the libraries Alamofire and Codable.

## Conclusion

We learnt how to use maybe the most popular library for networking in iOS, Alamofre. Also, we know how to combine with the Codable protocol from Apple, to parse our data in a efficient way. We defined our objects to parse them correctly, and we can access their properties without many problems.

Our basic networking layer help us to split the APIs logic in our app in another module, and to have a bit more organized our project architecture.

Thank you so much for reading the article!

### More sources:

* [https://medium.com/xcblog/painless-json-parsing-with-swift-codable-2c0beaeb21c1](https://medium.com/xcblog/painless-json-parsing-with-swift-codable-2c0beaeb21c1)

* [https://github.com/Alamofire/Alamofire](https://github.com/Alamofire/Alamofire)

* [https://github.com/Alamofire/Alamofire/blob/master/Documentation/Usage.md#making-a-request](https://github.com/Alamofire/Alamofire/blob/master/Documentation/Usage.md#making-a-request)
