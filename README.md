# Slideshow
 This program is written in Jquery, Slideshow Allows user to create single and multiple slideshow by just adjusting the Width of the cards (**slideshow-item**) </br>
 
 ## Format  
  * **className:**  your custom class which will be passed in the Creation of the object.
  * **active:** which card should be marked active.
  * **callback:** init has a optional callback parameter used for Cards Function. </br>
      ```
         Slideshow = new slide(className,active)
         Slideshow.init(callback);
      ``` 
      </br>

  * **HTML class:** separate the className with space </br>
      ```
         eg: <div class="slideshow className">
      ``` 
      </br>
  * **HTML ID:** do not separate the className with space </br>
      ```
        <button id="prevSingle" class="Controls prev"> &#60; </button>
        <button id="nextSingle" class="Controls next"> &#62; </button>
      ```
      </br>

