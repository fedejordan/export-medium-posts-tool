* * *

# How to apply Single Responsibility Principle in Swift

![](https://cdn-images-1.medium.com/max/1600/1*kSM1k05nq77ron-DjBX_FA.png)

Sometimes, when we are learning how to code, it’s difficult to understand the classes responsibilities concept. That’s the reason because our first projects become unmaintainable, containing many lines by class in our code and, much more critical, many amount of responsibilities.

A good way to really know the responsibility for a class is thinking in **scalability.**

Let’s see an example of how to use that. But before I would like to introduce a bit of theory and explain why this concept is important in software design.

### Introduction to Single Responsibility Principle

The idea of each class having a single responsibility in a software project, and that responsibility being encapsulated in one unique class has a name: [Single Responsibility Principle](https://en.wikipedia.org/wiki/Single_responsibility_principle)

This is one of the 5 main principles of software design [SOLID](https://en.wikipedia.org/wiki/SOLID_%28object-oriented_design%29) where, in [Object Oriented Programming](https://en.wikipedia.org/wiki/Object-oriented_programming), they try to define a guide to have a more understandable, flexible and maintainable software.

These principles are:

*   _Single responsibility principle_
*   _Open/closed principle_
*   _Liskov substitution principle_
*   _Interface segregation principle_
*   _Dependency inversion principle_

The author of these concepts, [Robert C. Martin,](https://es.wikipedia.org/wiki/Robert_C._Martin) (he wrote one of the most important books in software architecture, [Clean Code)](http://blog.cleancoder.com/) talks about _“A class should have only one reason to change”_, so he defines a responsibility as a _reason to change._

For instance, let’s consider a module that compiles and prints a report. Imagine such a module can be changed for two reasons. First, the content of the report could change. Second, the format of the report could change. These two things change for very different causes; one substantive, and one cosmetic.

The Single Responsibility Principle says that these two aspects of the problem are really two separate responsibilities, and should therefore be in separate classes or modules. It would be a bad design to couple two things that change for different reasons at different times.

The reason it is important to keep a class focused on a single concern is that it makes the class more robust. Continuing with the foregoing example, if there is a change to the report compilation process, there is greater danger that the printing code will break if it is part of the same class. _(Example extracted from_ [_Wikipedia_](https://en.wikipedia.org/wiki/Single_responsibility_principle)_)_

### Why is it important to define correctly each class responsibility

If we define our classes knowing which is their responsibility in our project we can:

*   Easily understand which functionality it does in each part of the code.
*   Modify existent logic faster and in detail.
*   Find with less problems the origin of the bugs or unwanted behaviours.
*   Abstract logic in different classes or modules.
*   Split without major problems implementations so they can be completely replaced later.
*   Define unit tests by class or module in a more efficient way, so we can test a little piece of the code, and no more that we really want to test.

### Thinking in the scability to define responsibilities

As I said before, you can think in the classes scability to define responsibilities. This is as simple as thinking if in our project might happen that the requirements will be modified, and look in our architecture how these modifications would take place.

If we see that for a small view change we have to modify or touch business logic, we are not correctly defining the responsibilities in our project, for instance.

Let’s see a concrete example in Swift.

### Swift example

Let’s say that I have an app which it shows a list of items from a store. By now I only have a `ItemsViewController` which is in charge of all the logic of that flow, the data and the presentation of that. Also, it prints a log when the user selects an item.

<iframe width="700" height="250" src="/media/e9dc728fc5c12cd532f072df8cec2e9b?postId=20cfd04abbea" data-media-id="e9dc728fc5c12cd532f072df8cec2e9b" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Favatars0.githubusercontent.com%2Fu%2F5657224%3Fs%3D400%26v%3D4&amp;key=a19fcc184b9711e1b4764040d3dc5c07" allowfullscreen="" frameborder="0"></iframe>ItemsViewController with view and data logic![](https://cdn-images-1.medium.com/max/1600/1*1Dq-bIVc5p8z3t_jLXb5Sw.png)ItemsViewController: A simple list of items

You can see the code in [https://github.com/fedejordan/SRPExample](https://github.com/fedejordan/SRPExample)

To do that, `ItemsViewController` uses a `UITableView` to show the items in a list. Also we’re using a `UITableViewCell` subclass called `ItemTableViewCell` to show these elements.

But let’s say that we want to change the view, for instance, with a `UICollectionView.` What would be the problem in this situation?

**The view code is very coupled to the items data logic.** If we change the view it’s very likely that we’ll modify the class in charge of the items as well.

The real problem is in these lines:

<pre name="961a" id="961a" class="graf graf--pre graf-after--p">let item = items[indexPath.row]</pre>

Why is the problem here?

Because we are using the `UITableView` index to get the specific item in the array. We should abstract in some way that the view uses an`UITableView`.

To avoid that, we’ll **refactor** `ItemsViewController` and we’ll move the model logic to another class called `ItemsInteractor`.

<iframe width="700" height="250" src="/media/186346723ee97797b6cdc4dfa8df09c5?postId=20cfd04abbea" data-media-id="186346723ee97797b6cdc4dfa8df09c5" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Favatars0.githubusercontent.com%2Fu%2F5657224%3Fs%3D400%26v%3D4&amp;key=a19fcc184b9711e1b4764040d3dc5c07" allowfullscreen="" frameborder="0"></iframe>ItemsViewController without data model logic<iframe width="700" height="250" src="/media/8a35ded502e6f138126a091aaaf224a7?postId=20cfd04abbea" data-media-id="8a35ded502e6f138126a091aaaf224a7" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Favatars0.githubusercontent.com%2Fu%2F5657224%3Fs%3D400%26v%3D4&amp;key=a19fcc184b9711e1b4764040d3dc5c07" allowfullscreen="" frameborder="0"></iframe>ItemsInteractor for abstract data logic

_The interactor concept has its origin in_ [_VIPER_](https://www.objc.io/issues/13-architecture/viper/) _architecture. As it is said in the definition, an Interactor contains the business logic to manipulate model objects (Entities) to carry out a specific task. In this case, our_ `_ItemsInteractor_` _is in charge of retrieving information about any_ `_Item._`

You can get this code in [https://github.com/fedejordan/SRPExample](https://github.com/fedejordan/SRPExample), in the branch `interactor_refactor`.

As we can see, `ItemsViewController` doesn’t know anything about the data model. It simply ask the Interactor what it needs to draw the view.

With this approach we can, for example, change the data type `Item` for any other thing, and we would only change `ItemsInteractor`. It would retrieve the same information (we wouldn’t change the public methods) and finally `ItemsViewController` could keep working as always.

So, with that refactor, if we want to change just the layout of our app, we simply change `ItemsViewController` to use an`UICollectionView`:

<iframe width="700" height="250" src="/media/567bb687f01828bc551fb9aad3aec97e?postId=20cfd04abbea" data-media-id="567bb687f01828bc551fb9aad3aec97e" data-thumbnail="https://i.embed.ly/1/image?url=https%3A%2F%2Favatars0.githubusercontent.com%2Fu%2F5657224%3Fs%3D400%26v%3D4&amp;key=a19fcc184b9711e1b4764040d3dc5c07" allowfullscreen="" frameborder="0"></iframe>ItemsViewController with a UICollectionView![](https://cdn-images-1.medium.com/max/1600/1*NexoB1dLm11FnxD04W3l6Q.png)ItemsViewController screenshot, using a UICollectionView

You can see the final result in [https://github.com/fedejordan/SRPExample](https://github.com/fedejordan/SRPExample) , `collection_view_refactor` branch.

Did we change something in `ItemsInteractor`? Just nothing. We simply changed the presentation of the feature.

This, also, allow us to test all in a more modularized way. We can first start to [test the view](https://medium.com/@federicojordn/how-to-do-ui-testing-in-ios-with-fbsnapshottestcase-caea27e3d5f4), and then the business logic. Of course that, for doing tests correctly, we need to do something more injectable, se we can initialize the modules with mocked classes and we depend of interfaces or `protocols` in Swift. Basically it means, for instance, not creating the `ItemsInteractor` inside `ItemsViewController`, because it’s an dependency, and it should be abstracted from its implementation. But all of this exceeds the article purpose.

### Conclusion

Seems that we didn’t do so much work. We simply removed the view logic from the data model. Was it really worth it? In this example, maybe it wasn’t too useful, in fact, could be that we simply need a list and nothing else.

But when we have more complex UIs, we have to adapt the same view to different data sources, or share the data model with different flows. Applying this concept allow us to reuse the code and scale the project in a more proper way. And to do that, it’s important to understand which responsibility should have each class that we maintain.

I would like to add that, in my opinion, this concept is a necessary condition to have a good code. In fact, in any code that is badly written, we will always find any class with more than one responsibility. It’s because of that we saw the importance of Single Responsibility Principle.

Our Swift example allowed us to understand why it’s important to define correctly the responsibilities. How a correct modularized architecture can be the key in the scability of our project, simply because we want to do a layout change.

As a summary I would like to conclude that, looking always in our project **scability**, we will be able to see if we are correctly defining our classes or modules responsibilities.

Thank you very much for reading the post!

I hope you enjoyed it. You can send any message or suggestion about the topics in the comments section, or simply sending me a mail to fedejordan99@gmail.com