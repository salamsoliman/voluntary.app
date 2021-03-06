
"use strict"

window.BMPostDraft = BMStorableNode.extend().newSlots({
    type: "BMPostDraft",
    content: "",
}).setSlots({
    
    init: function () {
        BMStorableNode.init.apply(this)
        this.addStoredSlots(["content"])
        this.addAction("delete")
        this.setContent("...".loremIpsum(40, 100))	
        this.setShouldStore(true)	
        this.nodeRowStyles().setToBlackOnWhite()
    },
	
    nodeRowLink: function() {
        return null
    },
	
    title: function() {
	    return this.content()
    },
	
    wasSentByMe: function() {
        return this.senderId() === this.localIdentity()
    },
	
    contentDict: function() {
        var contentDict = {}
        contentDict.content = this.content()
        return contentDict
    },
	
    setContentDict: function(contentDict) {
        this.setContent(contentDict.content)
        //this.scheduleSyncToView()
        return this
    },

    localIdentity: function() {
        return this.parentNodeOfType("BMLocalIdentity")
    },
    
    avatarImageDataURL: function() {
        return this.localIdentity().profile().profileImageDataUrl()
    },
	
    post: function() {
        var msg = BMPostMessage.clone()
        msg.setContent(this.content())
        msg.postFromSender(this.localIdentity())
        this.delete()
        //this.addMessage(msg)
    },
})

