import FastImage from 'react-native-fast-image';
import { trackError } from "../utils/common";


export const preloadImages =  (images) => {

  try {
    let imagesToLoad=[];

    if (images && images.length > 0){
      images.forEach(image=>{
                imagesToLoad.push({uri:image});
      })

        FastImage.preload(imagesToLoad);
    }


  } catch (error) {
    trackError(error)
  }
}
