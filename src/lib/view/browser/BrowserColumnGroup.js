
BrowserColumnGroup = NodeView.extend().newSlots({
    type: "BrowserColumnGroup",
    header: null,
    column: null,
    columnWrapper: null,
    emptyLabel: null,
	isSelected: false,
	doesCollapseIfUnselected: false,
	isCollapsed: false,
}).setSlots({
    init: function () {
        NodeView.init.apply(this)
        this.setDivClassName("BrowserColumnGroup")
        
        this.setHeader(BrowserHeader.clone())
        this.addSubview(this.header())
        
        this.setColumnWrapper(this)
        
        //this.setColumnWrapper(DivView.clone().setDivClassName("BrowserColumnWrapper"))
        //this.addSubview(this.columnWrapper())
        
        this.setColumn(BrowserColumn.clone())
        this.columnWrapper().addSubview(this.column())
        
        return this
    },

	isFirstColumnGroup: function() {
		return this.browser().columnGroups()[0] === this
	},

	setIsSelected: function(aBool) {
		if (this.column()) {
			this.column().setIsSelected(aBool)
		}
		
		if (this._isSelected == aBool) {
			return this
		}
		
		this._isSelected = aBool
	//	this.header().setDoesShowBackArrow(aBool && !this.isFirstColumnGroup())
		
		if (this.doesCollapseIfUnselected()) {
			if (aBool) {
				console.log(this + " expanding")
				this.uncollapse()
				//this.setMinAndMaxWidth("100%")
			} else {
				this.collapse()
				console.log(this + " collapsing")
			}
		}
		
		return this
	},
	
	previousColumnGroup: function() {
		//console.log("this.column() = ", this.column())
		var prevCol = this.column().previousColumn()
		if (prevCol) { return prevCol.columnGroup() }
		return null
	},
	
	isFirstUncollapsed: function() {
		var pcg = this.previousColumnGroup()
		return (!this.isCollapsed()) && (!pcg || pcg.isCollapsed())
	},
	
	updateBackArrow: function() {
		this.header().setDoesShowBackArrow(!this.isFirstColumnGroup() && this.isFirstUncollapsed())
		return this
	},
	
	// collapsing
	
	setIsCollapsed: function(aBool) {
		if (this._isCollapsed != aBool) {		
			if (aBool) {
				this.collapse()
			} else {
				this.uncollapse()
			}
			//this._isCollapsed = aBool
		}
		return this
	},
	
	/*
	isCollapsed: function() {
		return this.display() == "none"
	},
	*/
	
	collapse: function() {
		this._isCollapsed = true
		this.setDisplay("none")
		return this
	},
	
	uncollapse: function() {
		this._isCollapsed = false
		this.setDisplay("inline-flex")		
		var w = this.node() ? this.node().nodeMinWidth() : 100 // not sure why this happens
        this.setMinAndMaxWidth(w)
        this.setFlexGrow(1)
		return this
	},
    
    /// empty label 
    
    updateEmptyLabel: function() {
        var node = this.node()
        if (node) {
            if (node.subnodes().length == 0 && node.nodeEmptyLabel()) {
                this.setEmptyLabelText(node.nodeEmptyLabel())
                return this
            }
        }
            
        this.removeEmptyLabel()
        return this
    },
    
    addEmptyLabelIfMissing: function() {
        if (!this.emptyLabel()) {
            this.setEmptyLabel(DivView.clone().setDivClassName("BrowserColumnEmptyLabel"))
            this.setEmptyLabelText("").turnOffUserSelect()
            this.addSubview(this.emptyLabel())            
        }
        
        return this
    },
    
    setEmptyLabelText: function(aString) {       
        this.addEmptyLabelIfMissing()     
        this.emptyLabel().setInnerHTML(aString)
        return this
    },
    
    removeEmptyLabel: function() {
        if (this.emptyLabel()) {
            this.removeSubview(this.emptyLabel())
            this.setEmptyLabel(null)
        }
        return this
    },
    
    setColumnClass: function(columnClass) {
        if (this.column().type() != columnClass.type()) {
            var view = columnClass.clone().setNode(this.node())
            this.columnWrapper().removeSubview(this.column())
            this.setColumn(view)
            this.columnWrapper().addSubview(this.column())
            this.browser().clipToColumnGroup(this)
        }
        return this
    },
    
    setNode: function(aNode) {
        if (aNode == this._node) {
            //return
        }
         
        NodeView.setNode.apply(this, [aNode])

        this.setColumnClass(BrowserColumn)
        
        if (aNode) {
            
            // obey node's width preferences
            
            var w = this.node().nodeMinWidth()
            if (w) {
                //console.log("setNode setMinAndMaxWidth")
				if (!this.doesCollapseIfUnselected()) {
                	this.setMinAndMaxWidth(w)
				}
            }

            // use custom class for column if node wants it
            
            var customViewClass = aNode.viewClass()

            if (customViewClass) {
                this.setColumnClass(customViewClass)
            }
            
        } else {
            this.setColumnClass(BrowserColumn)
        }
        
        this.header().setNode(aNode)
        this.column().setNode(aNode)
        return this
    },

    browser: function() {
        return this.parentView()
    },
    

    /*
    NOT USED - VIEWS DON'T IMPLEMENT didUpdate now - they use didUpdateNode
    the syncFromNode overide in this class handles the subviews
    
    didUpdate: function() {
        dfdffdfdf()
        this.log("didUpdate")
        this.header().didUpdate()
        this.column().didUpdate()
        return this        
    },
    */

    // just using this to make debugging easier

    syncFromNode: function () {        
        //console.log("BrowserColumnGroup syncFromNode "  + this.node().type())
        this.header().syncFromNode()
        this.column().syncFromNode()
        this.updateEmptyLabel()
        return this
    },
})
