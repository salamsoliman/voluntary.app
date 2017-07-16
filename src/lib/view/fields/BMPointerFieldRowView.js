
BMPointerFieldView = BrowserTitledRow.extend().newSlots({
//BMPointerFieldView = BMFieldRowView.extend().newSlots({
    type: "BMPointerFieldView",
}).setSlots({
    init: function () {
        BrowserTitledRow.init.apply(this)
        
        //this.setDivClassName("BMPointerFieldView")
/*
		//this.noteView().setInnerHTML("→")
        this.valueView().setTarget(this).setAction("clickedOnValue")
        //this.valueView().setTarget(this).setAction("clickedOnValue")

		//this.setValueIsVisible(true)
        this.valueView().turnOffUserSelect()
        //this.valueView().setDisplay("none")
		//this.keyView().setMinAndMaxWidth(500)
		this.keyView().setContentAfterString("").setTextAlign("left")
		*/
		//this.setIsSelectable(true)
		
		this.setBorderBottom("1px solid #ddd")
        return this
    },

	selectedTextColor: function() {
		return "black"
	},
	
	unselectedTextColor: function() {
		return "#888"
	},
	
    selectedBgColor: function() {
        return "#ddd"
    },
})