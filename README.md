 
# ICL (Ichiro Configuration Language)

ICL is a configuration language, that aims to provide a concise and elegant way to describe your configurations files. Moreover ICL relies on some powerfull concepts taken from the OO world (such as inheritance, class, mixins...)  without falling into the trap of becoming a programming language.

## Key features:

+ Simplicity & Readability : thanks to a simple specification and a declarative syntax that is easy to understand and grasp, everyone can start to use and master ICL very quickly.
+ Non turing-complete language : common sens tells us that configuration language should not be programmable and stay simple, otherwise our configurations files turns to a spaghetti nightmare.
+ Full JSON / YAML compatibility : You can think of ICL as JSON / YAML cousin, everything that you can write in JSON or YAML can be expressed in ICL.
+ Powerfull Tooling : Even the best language in the world without tooling is almost useless in our time, this is why we developped a nice vs plugin to support your icl devs.

## Syntax : 

### Overview

Before diving deeper into ICL syntax here is a preview of what it looks like to write in ICL and it's equivalent in JSON on the right side

![hello world](https://s26.postimg.org/4jywag28p/Screen_Shot_2017-09-18_at_12.27.24.png)

As you can see, an ICL document is composed of a set of settings block, the latter has a category (in our example, it's "app"), followed by at least one property name and of course it's value (in our example it's "hello-world")

As the compiler reads your ICL documents and settings blocks one by one, it merges/interpolates and builds your final JSON/YAML document. Therefore as we will see later, you can split your declarations into multiple files which will increase the reutilisability and readability of your settings blocks.

### Comment
A hash symbol or a double forward slash marks the rest of the line as a comment.

	# this is a full-line comment
	// this is also a full line comment

Multi-line comment begins with /* and ends with */.

	/* this is a
	multiline comment */

### Basic structure
The primary building block in ICL is a settings block, it's a fundamental unit in ICL grammar, a settings block will hold a group of key/value pairs or even another sub settings block.
You can declare a settings block simply by specifiying a category (the category notion here is equivalent to a section in INI terminolgy), then you have to specify one or more properties and finally give a value to this block.

e.g.
	
	app "frontend" "instance_1" {
	        port = 3306
	}


This is equivalent to the following JSON structure

	{
	    "app": {
	        "frontend": {
	            "instance_1": {
	                "port": 3306
	            }
	        }
	    }
	}

However, if your settings block doesn't have a category, you can only put an underscore `_`
	
In our example, if i want my frontend to be "uncategorized" i simply put an underscore `_` instead of the category name `app`

e.g.

	  _ "frontend" "instance_1" {
	   		port = 3306
	   }

This is equivalent to the following JSON structure 
	
	{
		"frontend": {
			"instance_1": {
	    			"port": 3306
	 		}
		}
	}

### Library Settings Block
A library settings block is a block that will not be included in the generated (JSON/YAML) output, as you will see later those kind of blocks can be used as libraries.
In order to declare a settings block as a library you just have to prepend it's category name with `::`

e.g.

	::image "mysql" {
	   	url = "mysql:5.6",
		port = 3306
	}

The generated output will be an empty JSON in thise case.

### Inheritance 
In ICL every settings block can be used as a prototype for another settings block, in fact an ICL settings block can inherit properties from one or even several settings blocks enabling us to construct a settings block from the values of multiple ones.  

> If a setting block inherit from several other settings blocks that define the same properties, they will be overwritten based on the inheritance declaration order (the latest one will win obviously)

e.g.

	::image "settings" {
		memory = 8096
	}
	
	::image "mysql" {
		url = "mysql:5.6",
		port = 3306
	}
	
	db "instance_1" from image.mysql, image.settings {}
	db "instance_2" from image.mysql, image.settings {}

This is equivalent to the following JSON structure

e.g. 

	{
	    "db": {
	        "instance_1": {
	            "memory": 8096,
	            "port": 3306,
	            "url": "mysql:5.6"
	        },
	        "instance_2": {
	            "memory": 8096,
	            "port": 3306,
	            "url": "mysql:5.6"
	        }
	    }
	}


### Aliases
Every settings block can be aliased, by giving it an alias and declare it as a library settings block you are definining a type that can be reused later. Let's see again the previous example but this time we are going to leverage the use of the alias feature instead of explicitly specifying the inheritance.

e.g.

	::image "mysql" as MySQL {
		url = "mysql:5.6",
		port = 3306
	}
		
	MySQL "db" "instance_1" {}	
	MySQL "db" "instance_2" {}
	
This generates the following JSON 

	 {   
	 	"db": {
	        "instance_1": {
	            "port": 3306,
	            "url": "mysql:5.6"
	        },
	        "instance_2": {
	            "port": 3306,
	            "url": "mysql:5.6"
	        }
	    }
	}

### Mixins 
In order to make a settings block more reusable you can define some arguments, and then call this block later on with the appropriate values. That's what mixins are meant for.

e.g.

	::image "basic" @name, @version {
	    url = "@name:@version"
	}

The call of mixins is implemented in ICL by the keyword `apply` to which we pass the pairs parameter-value	
	
	app "mysql" apply image.basic @name="mysql", @version=5.6

The latter will generates this equivalent JSON output :

	{
	    "app": {
	        "mysql": {
	            "url": "mysql:5.6"
	        }
	    }
	}

### Assignements

The assignment operator is to assign a value to a particular property, it's like a mixin parameter but a one that will be assigned to a particular property, Its preceded by `@@` rather then `@`.

e.g.

	::image "mysql" {
	    url = "mysql:5.6",
	    port = 3306
	}
			
	mysql "instance_1" apply image.mysql @@port=3307 

This will generates the following JSON 

	{
	    "mysql": {
	        "instance_1": {
	            "port": 3307,
	            "url": "mysql:5.6"
	        }
	    }
	}

### Imports
Sometimes you want to split your icl declarations accross many files for maintainability, that's where imports comes into play, in ICL you can import as many icl files as you want and at any point in the icl file.(not necessarly at the top of the file)

e.g.

./lib.icl file

	::image "mysql" as MySQL {
		url = "mysql:5.6",
		port = 3306
	}

./app.icl file

	take lib
 	MySQL "db" "instance_1" {}	
	MySQL "db" "instance_2" {}
	
The generated output in JSON will be 

	 {   
	 	"db": {
	        "instance_1": {
	            "port": 3306,
	            "url": "mysql:5.6"
	        },
	        "instance_2": {
	            "port": 3306,
	            "url": "mysql:5.6"
	        }
	    }
	}


When the compiler reads the `take` line, it copies the contents of file1,file2...at that point into the current file.
  
    
### Data types     
    
#### Number

The number type is used for any numeric type, either integers or floating point numbers, positive numbers may be prefixed with a plus sign. Negative numbers are prefixed with a minus sign.

e.g.          
	
	cloud "digiteal_ocean" "transfer" 5 
        
     /* Here the setting block cotain 
        cloud as category and digitealocean as property 
        and transfer as sub_property and 5 as integer value */
        
	 cloud "digiteal_ocean" "droplet" {
            port = 3306,
            price = +4.5
       }
       
#### Boolean
It includes true or false values.

e.g: 
	    
	cloud "digiteal_ocean" "fw" true 
	                                

#### String

Strings can be double quoted `"`or single quoted `'` and can contain any text. If your string contains a double quote or a single quote you can escape them \" or \' 

e.g.: 

	cloud "digital_ocean" {
		name = 'this is just mysql digital ocean\'s droplet'
	} 

or 
	
	cloud "digital_ocean" {
		name = "this is just mysql digital ocean's droplet"
	} 

Note the 'quotes' around the value. When the value is a text string, 

All strings are multiline by default, no need to do any extra stuff:

e.g.

	app "hello-world" {
	            name = "this is 
			a multiline 
	            string",
	            price = +4.5
	 }

This generates the following JSON : 

	{
	    "app": {
	        	"hello-world": {
	            		"name": "this is \na multiline \nstring",
	            		"price": 4.5
	        	}
	    }
	}

#### Raw Data

ICL can handle the insertion of raw data such as encoded image files. this can be achieved in ICL through [heredoc](https://en.wikipedia.org/wiki/Here_document) 

e.g.: 
   
     app "hello-world" {
            icon = <<<EOF R0lGODlhPQBEAPeoAJosMAwOAwHVYZz595kzAPs7P+goOXMv8+fhwv739f+8PD98fH8mJl+fn9ZWb8PzWlwv6wWGbImAPgTEMImIN9gUFCEmgDALULDN8PAD6atYdCTX9gUNKlj8wZAKUsAOzZz+UMAOsJAPZ2ccMDA8PD95eX5NWvsJCOVNQPtfX8zM8+QePLl38MGBr8JCP+zs9myn8GBqwpAPGxgwJCPny78lzYLgjAJ8vAP9fX+MjMUcAN8zM9wcM8ZGcATEL+QePdZWf
            29ucP9cmJu9MTDImIN+r7+vz8P8VNQGNugV8AAF9fX8swMNg
            TAFlDOICAgPNSUnNWSMQ5MBAQEJE3Q
            EOF
	}
 
#### Null
Null values can be declared with the `null` keyword

e.g.

	 app "settings"{
	 	max_count = null
	 }


#### List       

Lists are square brackets with values inside, whitespace is ignored. Elements are separated by commas. Lists can contain primitives, other Lists, maps and raw data.

e.g.  
           
	cloud "digitealocean" "transfer" option [  
                    1, // integer
                    3.5, // float
                    "simple string", // another string
                    [1,2,3, [1,2,3]], // list of list of list
                    ["foo", "bar", 3.14, [1, 5], {"foo", "bar",5...}...], 
                    {key = "foo","bar"... } // map
                      ]

#### Table 
Table are 2 dimensional array and declared through the `table` keyword

	app "hello-world" "dns" table "localhost" 	= "127.0.0.1",
						"hello-world.com"   = "221.192.199.49"

#### Map

Maps are a collections of key-value pairs (delimited by `,`). maps are enclosed in curly braces `{` and `}`

e.g.    

    map "elements" {
    		property1 = "value1",
    		property2 = "value2"
    }

The value of each property can be of any type (number, boolean, map, list, null...)
 			            
## Get Involved

We love contributions! There's lots to do on ICL and vscode extension, so why not chat with us about what you're interested in doing? Please join the #Ichiro channel on our Slack channel and let us know about your plans.

Documentation, bug reports, pull requests, and all other contributions are welcome!

To suggest a feature or report a bug: https://github.com/archipaorg/icl/issues


