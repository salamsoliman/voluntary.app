
BMRemotePeer = BMNode.extend().newSlots({
    type: "BMRemotePeer",
    conn: null,
    serverConnection: null,
    messages: null,
    status: null,
    remoteInventory: null,
    debug: true
}).setSlots({
    init: function () {
        BMNode.init.apply(this)
        this.setTitle("Peer")
        
        this.setMessages(BMNode.clone().setTitle("messages").setNoteIsItemCount(true))
        this.addItem(this.messages())
        this.setRemoteInventory({})
    },
    
    log: function(s) {
        console.log(this.type() + " " + this.id() + " " + s)
        return this
    },
    
    network: function() {
        //return this.parentNodeOfType("BMNetwork")
        return this.serverConnection().server().servers().network()
    },
    
    id: function () {
        return this.conn().peer
    },

    shortId: function() {
        var id = this.id()
        var maxLength = 7
        if (id.length > maxLength) {
            return id.substring(id.length - maxLength)
        }
        
        return id
    },
    
    subtitle: function () {
        return this.status()
    },   
    
    addMessage: function (msg) {
        return this.messages().addItem(msg)
    },

    setConn: function (aConn) {
        this._conn = aConn
        this.setStatus("connecting...")
        this.log("connecting")
        this.setTitle("Peer " + this.shortId())
                    
        if (this._conn) {
            var self = this
            this._conn.on('open', function() { self.onOpen() })
            this._conn.on('error', function(err) { self.onError(err) })
        }

        this.startConnectTimeout()
        
        return this
    },
    
    syncToView: function() {
        BMNode.syncToView.apply(this)
        //console.log("syncToView ", this.view())
    },
    
    startConnectTimeout: function () {
        var timeoutSeconds = 45
        setTimeout(() => { 
            if (!this.isConnected()) {
                this.close()
                this.setStatus("connect timeout")
                this.didUpdate()
                this.serverConnection().onRemotePeerClose(this)
                this.log("connect timeout")
            }   
        }, timeoutSeconds*1000)        
    },
    
    close: function() {
        this._conn.close()
        this.setStatus("closed")
        this.didUpdate()
        return this 
    },
    
    isConnected: function () {
        return this.status() == "connected"
    },

    onOpen: function(c) {
        this.log("onOpen")
        this.setTitle("Peer " + this.shortId())
        this.didUpdate()
        this.setStatus("connected")
        
        var self = this
        this._conn.on('data', function(data) { self.onData(data) })
        this._conn.on('close', function(err) { self.onClose(err) })

        this.didUpdate()
        //this.sendPing()
        this.network().onRemotePeerConnect(this)
    },

    onError: function(error) {
        this.setStatus("error")
        this.log(" onError " + error)
    },

    onClose: function(err) {
        this.setStatus("closed")
        this.log("onClose " + err)
        this.serverConnection().onRemotePeerClose(this)
        console.trace("RemotePeer onClose")
        if (this.parentNode() == null) {
            console.log("missing this.parentNode() on BMRemotePeer onClose")
        } else {
            this.parentNode().removeItem(this)
        }
     },

    onData: function(data) {
        this.setStatus("connected")
        this.log("onData '" + data + "'")
        var msg = BMMessage.messageForString(data)
        msg.setSubtitle("via peer " + this.shortId())
        msg.setRemotePeer(this)
        this.addMessage(msg)
        //this.serverConnection().receivedMsgFrom(data, this)
        //this.log("msg.msgType() = '" + msg.msgType() + "'")
        this[msg.msgType()].apply(this, [msg])
    },

    sendMsg: function(msg) {
        msg.setSubtitle("sent to peer " + this.shortId())
        this.addMessage(msg)
        this.sendData(msg.msgDictString())
    },
    
    sendData: function(data) {
        this.log("send '" + data + "'")
        this._conn.send(data)
        return this
    },
    
    // send messages
    
    sendPing: function() {
        this.sendMsg(BMPingMessage.clone())
        return this
    },
    
    sendPong: function() {
        this.sendMsg(BMPongMessage.clone())
        return this
    },
    
    // receive messages
    
    ping: function(msg) {
        this.log("got ping")
        this.sendPong()
    },
    
    pong: function(msg) {
        this.log("got pong")
    },
    
    addr: function(msg) {
        this.log("got addr")
        this.network().addr(msg)
    },
    
    markSeenHash: function(aHash) {
        this.remoteInventory()[aHash] = true
        return true
    },
    
    inv: function(msg) {
        this.log("got inv")
        // TODO: track local inventory, 
        // blacklist if sender repeats any hashes
        this.network().messages().inv(msg)
        
        // mark these hashes as seen
        var self = this
        msg.data().forEach(function(hash) {
            self.markSeenHash(hash)
        })
    },
    
    getData: function(msg) {
        this.network().messages().getData(msg)
    },
    
    object: function(msg) {
        this.log("got object")
        
        var msgs = this.network().messages()
        
        if (msgs.validateMsg(msg)) {
            msgs.object(msg)
        } else {
            this.close()
            this.status("error: received invalid object")
        }            
            
        /*
        let messages object validate it 
        if (msg.actualPowDifficulty() > this.minimumDifficulty()) {
            // mark it as seen, just to be safe
            this.remoteInventory()[msg.msgHash()] = true
            
            this.network().messages().object(msg)
        } else {
            this.close()
            this.status("error: received invalid object")
        }
        */
    },
    
    hasSeenMsgHash: function(aHash) {
        return aHash in this.remoteInventory()
    },
    
    addedObjectMsg: function(msg) {
        if (!this.hasSeenMsgHash(msg.msgHash())) {
            this.sendMsg(msg)
        }
        return this
    },
})