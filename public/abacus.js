/*!
 * abacus - the smart video analytics platform
 * Copyright (c) 2015 Neil Gupta
 * Version 1.0.0
 */

var abacus = (function() {
  // websocket-rails.js - https://github.com/websocket-rails/websocket-rails-js
  (function(){var __bind=function(fn,me){return function(){return fn.apply(me,arguments)}};this.WebSocketRails=function(){function WebSocketRails(url,use_websockets){this.url=url,this.use_websockets=null!=use_websockets?use_websockets:!0,this.connection_stale=__bind(this.connection_stale,this),this.pong=__bind(this.pong,this),this.supports_websockets=__bind(this.supports_websockets,this),this.dispatch_channel=__bind(this.dispatch_channel,this),this.unsubscribe=__bind(this.unsubscribe,this),this.subscribe_private=__bind(this.subscribe_private,this),this.subscribe=__bind(this.subscribe,this),this.dispatch=__bind(this.dispatch,this),this.trigger_event=__bind(this.trigger_event,this),this.trigger=__bind(this.trigger,this),this.unbind=__bind(this.unbind,this),this.bind=__bind(this.bind,this),this.connection_established=__bind(this.connection_established,this),this.new_message=__bind(this.new_message,this),this.reconnect=__bind(this.reconnect,this),this.callbacks={},this.channels={},this.queue={},this.connect()}return WebSocketRails.prototype.connect=function(){return this.state="connecting",this._conn=this.supports_websockets()&&this.use_websockets?new WebSocketRails.WebSocketConnection(this.url,this):new WebSocketRails.HttpConnection(this.url,this),this._conn.new_message=this.new_message},WebSocketRails.prototype.disconnect=function(){return this._conn&&(this._conn.close(),delete this._conn._conn,delete this._conn),this.state="disconnected"},WebSocketRails.prototype.reconnect=function(){var event,id,old_connection_id,_ref,_ref1;old_connection_id=null!=(_ref=this._conn)?_ref.connection_id:void 0,this.disconnect(),this.connect(),_ref1=this.queue;for(id in _ref1)event=_ref1[id],event.connection_id!==old_connection_id||event.is_result()||this.trigger_event(event);return this.reconnect_channels()},WebSocketRails.prototype.new_message=function(data){var event,socket_message,_i,_len,_ref,_results;for(_results=[],_i=0,_len=data.length;_len>_i;_i++)socket_message=data[_i],event=new WebSocketRails.Event(socket_message),event.is_result()?(null!=(_ref=this.queue[event.id])&&_ref.run_callbacks(event.success,event.data),delete this.queue[event.id]):event.is_channel()?this.dispatch_channel(event):event.is_ping()?this.pong():this.dispatch(event),_results.push("connecting"===this.state&&"client_connected"===event.name?this.connection_established(event.data):void 0);return _results},WebSocketRails.prototype.connection_established=function(data){return this.state="connected",this._conn.setConnectionId(data.connection_id),this._conn.flush_queue(),null!=this.on_open?this.on_open(data):void 0},WebSocketRails.prototype.bind=function(event_name,callback){var _base;return null==(_base=this.callbacks)[event_name]&&(_base[event_name]=[]),this.callbacks[event_name].push(callback)},WebSocketRails.prototype.unbind=function(event_name){return delete this.callbacks[event_name]},WebSocketRails.prototype.trigger=function(event_name,data,success_callback,failure_callback){var event,_ref;return event=new WebSocketRails.Event([event_name,data,null!=(_ref=this._conn)?_ref.connection_id:void 0],success_callback,failure_callback),this.trigger_event(event)},WebSocketRails.prototype.trigger_event=function(event){var _base,_name;return null==(_base=this.queue)[_name=event.id]&&(_base[_name]=event),this._conn&&this._conn.trigger(event),event},WebSocketRails.prototype.dispatch=function(event){var callback,_i,_len,_ref,_results;if(null!=this.callbacks[event.name]){for(_ref=this.callbacks[event.name],_results=[],_i=0,_len=_ref.length;_len>_i;_i++)callback=_ref[_i],_results.push(callback(event.data));return _results}},WebSocketRails.prototype.subscribe=function(channel_name,success_callback,failure_callback){var channel;return null==this.channels[channel_name]?(channel=new WebSocketRails.Channel(channel_name,this,!1,success_callback,failure_callback),this.channels[channel_name]=channel,channel):this.channels[channel_name]},WebSocketRails.prototype.subscribe_private=function(channel_name,success_callback,failure_callback){var channel;return null==this.channels[channel_name]?(channel=new WebSocketRails.Channel(channel_name,this,!0,success_callback,failure_callback),this.channels[channel_name]=channel,channel):this.channels[channel_name]},WebSocketRails.prototype.unsubscribe=function(channel_name){return null!=this.channels[channel_name]?(this.channels[channel_name].destroy(),delete this.channels[channel_name]):void 0},WebSocketRails.prototype.dispatch_channel=function(event){return null!=this.channels[event.channel]?this.channels[event.channel].dispatch(event.name,event.data):void 0},WebSocketRails.prototype.supports_websockets=function(){return"function"==typeof WebSocket||"object"==typeof WebSocket},WebSocketRails.prototype.pong=function(){var pong,_ref;return pong=new WebSocketRails.Event(["websocket_rails.pong",{},null!=(_ref=this._conn)?_ref.connection_id:void 0]),this._conn.trigger(pong)},WebSocketRails.prototype.connection_stale=function(){return"connected"!==this.state},WebSocketRails.prototype.reconnect_channels=function(){var callbacks,channel,name,_ref,_results;_ref=this.channels,_results=[];for(name in _ref)channel=_ref[name],callbacks=channel._callbacks,channel.destroy(),delete this.channels[name],channel=channel.is_private?this.subscribe_private(name):this.subscribe(name),channel._callbacks=callbacks,_results.push(channel);return _results},WebSocketRails}()}).call(this),function(){WebSocketRails.Event=function(){function Event(data,success_callback,failure_callback){var attr;this.success_callback=success_callback,this.failure_callback=failure_callback,this.name=data[0],attr=data[1],null!=attr&&(this.id=null!=attr.id?attr.id:65536*(1+Math.random())|0,this.channel=null!=attr.channel?attr.channel:void 0,this.data=null!=attr.data?attr.data:attr,this.token=null!=attr.token?attr.token:void 0,this.connection_id=data[2],null!=attr.success&&(this.result=!0,this.success=attr.success))}return Event.prototype.is_channel=function(){return null!=this.channel},Event.prototype.is_result=function(){return"undefined"!=typeof this.result},Event.prototype.is_ping=function(){return"websocket_rails.ping"===this.name},Event.prototype.serialize=function(){return JSON.stringify([this.name,this.attributes()])},Event.prototype.attributes=function(){return{id:this.id,channel:this.channel,data:this.data,token:this.token}},Event.prototype.run_callbacks=function(success,result){return this.success=success,this.result=result,this.success===!0?"function"==typeof this.success_callback?this.success_callback(this.result):void 0:"function"==typeof this.failure_callback?this.failure_callback(this.result):void 0},Event}()}.call(this),function(){WebSocketRails.AbstractConnection=function(){function AbstractConnection(url,dispatcher){this.dispatcher=dispatcher,this.message_queue=[]}return AbstractConnection.prototype.close=function(){},AbstractConnection.prototype.trigger=function(event){return"connected"!==this.dispatcher.state?this.message_queue.push(event):this.send_event(event)},AbstractConnection.prototype.send_event=function(event){return null!=this.connection_id?event.connection_id=this.connection_id:void 0},AbstractConnection.prototype.on_close=function(event){var close_event;return this.dispatcher&&this.dispatcher._conn===this?(close_event=new WebSocketRails.Event(["connection_closed",event]),this.dispatcher.state="disconnected",this.dispatcher.dispatch(close_event)):void 0},AbstractConnection.prototype.on_error=function(event){var error_event;return this.dispatcher&&this.dispatcher._conn===this?(error_event=new WebSocketRails.Event(["connection_error",event]),this.dispatcher.state="disconnected",this.dispatcher.dispatch(error_event)):void 0},AbstractConnection.prototype.on_message=function(event_data){return this.dispatcher&&this.dispatcher._conn===this?this.dispatcher.new_message(event_data):void 0},AbstractConnection.prototype.setConnectionId=function(connection_id){this.connection_id=connection_id},AbstractConnection.prototype.flush_queue=function(){var event,_i,_len,_ref;for(_ref=this.message_queue,_i=0,_len=_ref.length;_len>_i;_i++)event=_ref[_i],this.trigger(event);return this.message_queue=[]},AbstractConnection}()}.call(this),function(){var __hasProp={}.hasOwnProperty,__extends=function(child,parent){function ctor(){this.constructor=child}for(var key in parent)__hasProp.call(parent,key)&&(child[key]=parent[key]);return ctor.prototype=parent.prototype,child.prototype=new ctor,child.__super__=parent.prototype,child};WebSocketRails.WebSocketConnection=function(_super){function WebSocketConnection(url,dispatcher){this.url=url,this.dispatcher=dispatcher,WebSocketConnection.__super__.constructor.apply(this,arguments),this.url.match(/^wss?:\/\//)?console.log("WARNING: Using connection urls with protocol specified is depricated"):this.url="https:"===window.location.protocol?"wss://"+this.url:"ws://"+this.url,this._conn=new WebSocket(this.url),this._conn.onmessage=function(_this){return function(event){var event_data;return event_data=JSON.parse(event.data),_this.on_message(event_data)}}(this),this._conn.onclose=function(_this){return function(event){return _this.on_close(event)}}(this),this._conn.onerror=function(_this){return function(event){return _this.on_error(event)}}(this)}return __extends(WebSocketConnection,_super),WebSocketConnection.prototype.connection_type="websocket",WebSocketConnection.prototype.close=function(){return this._conn.close()},WebSocketConnection.prototype.send_event=function(event){return WebSocketConnection.__super__.send_event.apply(this,arguments),this._conn.send(event.serialize())},WebSocketConnection}(WebSocketRails.AbstractConnection)}.call(this),function(){var __bind=function(fn,me){return function(){return fn.apply(me,arguments)}};WebSocketRails.Channel=function(){function Channel(name,_dispatcher,is_private,on_success,on_failure){var event,event_name,_ref;this.name=name,this._dispatcher=_dispatcher,this.is_private=null!=is_private?is_private:!1,this.on_success=on_success,this.on_failure=on_failure,this._failure_launcher=__bind(this._failure_launcher,this),this._success_launcher=__bind(this._success_launcher,this),this._callbacks={},this._token=void 0,this._queue=[],event_name=this.is_private?"websocket_rails.subscribe_private":"websocket_rails.subscribe",this.connection_id=null!=(_ref=this._dispatcher._conn)?_ref.connection_id:void 0,event=new WebSocketRails.Event([event_name,{data:{channel:this.name}},this.connection_id],this._success_launcher,this._failure_launcher),this._dispatcher.trigger_event(event)}return Channel.prototype.destroy=function(){var event,event_name,_ref;return this.connection_id===(null!=(_ref=this._dispatcher._conn)?_ref.connection_id:void 0)&&(event_name="websocket_rails.unsubscribe",event=new WebSocketRails.Event([event_name,{data:{channel:this.name}},this.connection_id]),this._dispatcher.trigger_event(event)),this._callbacks={}},Channel.prototype.bind=function(event_name,callback){var _base;return null==(_base=this._callbacks)[event_name]&&(_base[event_name]=[]),this._callbacks[event_name].push(callback)},Channel.prototype.unbind=function(event_name){return delete this._callbacks[event_name]},Channel.prototype.trigger=function(event_name,message){var event;return event=new WebSocketRails.Event([event_name,{channel:this.name,data:message,token:this._token},this.connection_id]),this._token?this._dispatcher.trigger_event(event):this._queue.push(event)},Channel.prototype.dispatch=function(event_name,message){var callback,_i,_len,_ref,_ref1,_results;if("websocket_rails.channel_token"===event_name)return this.connection_id=null!=(_ref=this._dispatcher._conn)?_ref.connection_id:void 0,this._token=message.token,this.flush_queue();if(null!=this._callbacks[event_name]){for(_ref1=this._callbacks[event_name],_results=[],_i=0,_len=_ref1.length;_len>_i;_i++)callback=_ref1[_i],_results.push(callback(message));return _results}},Channel.prototype._success_launcher=function(data){return null!=this.on_success?this.on_success(data):void 0},Channel.prototype._failure_launcher=function(data){return null!=this.on_failure?this.on_failure(data):void 0},Channel.prototype.flush_queue=function(){var event,_i,_len,_ref;for(_ref=this._queue,_i=0,_len=_ref.length;_len>_i;_i++)event=_ref[_i],this._dispatcher.trigger_event(event);return this._queue=[]},Channel}()}.call(this);

  // TODO fix hard-coding of localhost domain
  var dispatcher = new WebSocketRails('localhost:5000/websocket')

  , debug = false
  , successCallback = function(response) {
    if (debug) {
      console.log("Abacus: user " + response.message);
    }
  }
  , errorCallback = function(response) {
    console.log("Abacus: " + response.message + " (" + response.status + ")");
  }

  // constructs and sends websocket messages to abacus server
  , report = function(eventName, timestamp, duration, mediaId, userId, props) {
    var message = {
      origin: window.location.host,
      app_key: apiKey(),
      user_id: userId,
      media_id: mediaId,
      event_type: eventName,
      timestamp: Math.floor(timestamp),
      duration: Math.floor(duration)
    };

    if (props) {
      // merge in optional props
      for (var attrname in props) { message[attrname] = props[attrname]; }
    }

    if (dispatcher.connection_stale()) {
      // try reconnecting if needed
      dispatcher.reconnect();
    }

    // save event
    dispatcher.trigger('event.create', message, successCallback, errorCallback);
  }

  // getter/setter for abacus api key
  , apiKey = function(newApiKey) {
    if (newApiKey) {
      window.abacusApiKey = newApiKey;
    }

    return window.abacusApiKey;
  };

  return {
    apiKey: apiKey,
    report: report,

    // getter/setter for debug, prints success messages to console if true
    debug: function(setDebug) {
      if (setDebug !== undefined) {
        debug = !!setDebug;
      }

      return debug;
    },

    // add listeners to various HTML5 video events and report them to abacus
    register: function(video, mediaId, userId) {
      var currKnownTime = 0,
          lastKnownTime = 0,
          lastHearbeat = 0;

      video.addEventListener("play", function() {
        report("play", video.currentTime, video.duration, mediaId, userId);
        lastHearbeat = new Date().getTime();
      });

      video.addEventListener("pause", function() {
        report("pause", video.currentTime, video.duration, mediaId, userId);
        lastHearbeat = new Date().getTime();
      });

      video.addEventListener("seeked", function() {
        if (!video.paused && Math.floor(lastKnownTime) !== Math.floor(video.currentTime)) {
          // Video was playing, but we started seeking. Treat it like we
          // paused and played again, so we can start a new play segment
          report("pause", lastKnownTime, video.duration, mediaId, userId);
          report("play", video.currentTime, video.duration, mediaId, userId);
          lastHearbeat = new Date().getTime();
        }
      });

      video.addEventListener("volumechange", function() {
        if (video.currentTime > 3 || video.volume < 0.1) {
          // Ignore volume changes from the first 3 seconds, since that
          // says little about the video itself, unless the video is muted
          report("volumechange", video.currentTime, video.duration, mediaId, userId, {volume: video.volume});
        }
      });

      video.addEventListener("timeupdate", function() {
        // only track at second-level precision, and not while video is seeking
        if (!video.seeking && Math.floor(video.currentTime) !== Math.floor(currKnownTime)) {
          lastKnownTime = currKnownTime;
          currKnownTime = video.currentTime;
        }

        // send a heartbeat every 5 seconds while video is playing
        if (!video.paused && !video.seeking && lastHearbeat < new Date().getTime() - 5000) {
          report("pause", video.currentTime, video.duration, mediaId, userId);
          lastHearbeat = new Date().getTime();
        }
      });
    }
  };
})();

// Add AMD compatibility.
if (typeof define === 'function' && define.amd) {
  define(abacus);
}
// Add CommonJS compatibility.
else if (typeof module !== 'undefined' && module.exports) {
  module.exports = abacus;
}
