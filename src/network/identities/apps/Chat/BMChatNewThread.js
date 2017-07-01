
BMChatNewThread = BMNode.extend().newSlots({
    type: "BMChatNewThread",
}).setSlots({
    
    init: function () {
        BMNode.init.apply(this)
        this.setTitle("new thread")        
    },

    localIdentity: function() {
        return this.parentNodeOfType("BMLocalIdentity")
    },

    remoteIdentities: function() {
        return App.shared().remoteIdentities()
    },

    prepareToAccess: function() {
		var items = this.remoteIdentities().items().map((rid) => { return BMChatContact.clone().setRemoteIdentity(rid) })
        this.setItems(items)
    },
})

