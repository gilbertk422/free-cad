Board tools are tools for interactive manipulation of the data.


#### The logic of tools changing 
The tools can be changed by a few endpoints like as: 

1. Manually change - is when the user clicks a button on the UI for changing tool.

2. Change after executing some command - some tools must be changed to another tool after executing some command.
    * After adding some element (**AddElementCommand**) (see list of the type of the created elements following)- tool must be changed to the **SelectedTool**
        * LineElement
        * Group (RectTool, FreehandTool)
        * CircleElement
        * TextElement
    * After adding Spline element (**AddElementCommand**) - tool must be changed to the **EditLineTool**
    * After create a Ruler LineElement  (**AddElementCommand**)  - the tool mustn't be changed
       
3. Press the [space] key - that event will change the current tool to the last used tool.
    
    If current to is **SelectTool** the tool will be changed to last used tool. 
        
    If the current tool isn't **SelectTool** the tool will be changed to the **SelectTool**.
    
    **Note**: *isn't work for TextTool, for example: if select the TextToot and press the space key 
     the tool will not be changing to the SelectTool. (can be a bug in the desktop version)*

Copyright (c) 2019 Micro Logic Corp.