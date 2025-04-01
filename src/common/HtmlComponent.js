import React from 'react';
import { View,Text,Image,StyleSheet,Dimensions} from 'react-native';
import RenderHtml from 'react-native-render-html';
var striptags = require('striptags');


const IMAGES_MAX_WIDTH = Dimensions.get('window').width - 50;
const width = Dimensions.get('screen').width;
let CUSTOM_STYLES = {};
let CUSTOM_RENDERERS = {
    // img:(props) =>  {
    //     const {height,width} = props;
    //     return(
    //         <Image source={{uri:props.src}} resizeMode='contain' style={{height:100,width:100,marginHorizontal:0,marginVertical:0}} />
    //     )
    // },
}

  
  const renderersProps = {
    img: {
      initialDimensions :{width: 20, height: 20 },
      enableExperimentalPercentWidth : true
    }
  };
  

const HtmlComponent = (props) => {
    let {text,style,tintColor,containerStyle,baseFontStyle} = props;

    const appliedStyles = {...style,flexDirection:'row',flexWrap:'wrap',alignItems:'center',justifyContent:'flex-start'}
    if(text.length>0){
        text.replace("&nbsp;", " ");
        text = striptags(text,'<p><img>');
    }
    const source = {
        html: text
      };

    CUSTOM_STYLES = { 
        p: appliedStyles,
        span: style,
        i: style,
        em: style,
        body: style
    };

    const DEFAULT_PROPS = {
        tagsStyles: CUSTOM_STYLES,
        renderers: CUSTOM_RENDERERS,
        imagesMaxWidth: IMAGES_MAX_WIDTH,
        bool:false
    };


    return(
        // <HTML {...DEFAULT_PROPS} baseFontStyle={baseFontStyle} containerStyle={containerStyle} html= {text}  />
        <RenderHtml
            source={source}
            renderersProps={renderersProps}
            baseFontStyle={baseFontStyle}
            {...DEFAULT_PROPS}
            contentWidth={width-100}
            />
    )


}

HtmlComponent.defaultProps = {
    text: '',
    // tintColor: COLORS.BLACK,
    containerStyle: null,
    baseFontStyle: 16
  };

export default HtmlComponent;
