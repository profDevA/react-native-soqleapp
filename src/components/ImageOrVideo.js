import React from "react";
import {Dimensions,View,Text} from 'react-native';
import FastImage from 'react-native-fast-image';
import Video from "react-native-gifted-chat/node_modules/react-native-video";
let {height,width} = Dimensions.get('window')

const ImageOrVideo = (props) =>{
    if(props.type == "video"){
        return(
            <View>
            <Video source={props.source}   // Can be a URL or a local file.
          ref={(ref) => {
            // this.player = ref
          }}                                      // Store reference
                     // Callback when video cannot be loaded
          fullscreen={false}
          resizeMode={"cover"}
          muted={true}
          rate={1.0}
          controls={false}
          repeat={true}
          onLoad={(onLoad)=>{
            console.log("onLoadonLoad",onLoad)
        }}
          onLoadStart={(onLoadStart)=>{
            console.log("onLoadStart",onLoadStart)
        }}
          onReadyForDisplay={(onReadyForDisplay)=>{
            console.log("onReadyForDisplay",onReadyForDisplay)
        }}
          onBuffer={(buffer)=>{
            console.log("bufferbufferbuffer",buffer)
        }}                // Callback when remote video is buffering
          onError={(error)=>{
            console.log("errorororr",error)
           }}     
          ignoreSilentSwitch={"obey"}
          style={{height: height,width :width, position: "absolute",
          top: 0,
          left: 0,
          alignItems: "stretch",
          backgroundColor : props.videoBackgroundColor,
        //   zIndex: 10,
          bottom: 0,
          right: 0}} >
           

              </Video>
                
        <View style={{height: height,width :width,}}>
            {props.children}
        </View> 
        </View>
        )
    }else{
        return(<FastImage
            style={props.style}
            source={props.source}
            >
                {props.children}
            </FastImage>)
        
    }
   
}
ImageOrVideo.default = {
    onBuffer: (buffer)=>{
        console.log("bufferbufferbuffer",buffer)
    },
    onError : (error)=>{
     console.log("errorororr",error)
    },
    onLoad : (onLoad)=>{
        console.log("onLoadonLoad",onLoad)
       },
       onLoadStart : (onLoadStart)=>{
        console.log("onLoadStart",onLoadStart)
       },
       onReadyForDisplay : (onReadyForDisplay)=>{
        console.log("onReadyForDisplay",onReadyForDisplay)
       }
}

ImageOrVideo.defaultProps = {
  videoBackgroundColor: "black"
}
export default ImageOrVideo;