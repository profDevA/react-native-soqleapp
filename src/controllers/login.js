import { saveWorld, getUserLastLoginInfo, createUserLogin} from "../realm/RealmHelper";
import {post} from "../controllers/http"
import { gSignin } from "../controllers/google"
import NavigationService from '../navigator/NavigationService';

export const initiateLogin = async (type, email, password, loader) => {
  let currentLogin = new Date().toString();
  let world, user;
  try{
    let data;
    if (type==="google"){
      const userInfo = await gSignin();
       data = {type:type, userInfo:userInfo}
    }

    if (type==="web"){
       data = {type:type, email:email, password:password, name: 'hardcoded'}
    }

    if(loader) {  loader(true);}
    const response = await post("/auth/sign-in", data)
    if(loader) { loader(false); }
    if (!response || response ===null){
        return ;
    }

    world = response.data.world
    user = response.data.user

    saveWorld(world, user);
    createUserLogin(user, currentLogin);
    let dataSent= {
      user: user,
      world: world
    }
    NavigationService.navigate('Story', dataSent);
  } catch (e) {
    if(loader) { loader(false);}
      console.log("error1", e);
  }

}

//for google login
export const userLogin = async (email, password, type, extId, data) => {
let currentLogin = new Date().toString();
  if (type==="google"){

  }

  const response = await instance.post('/auth/sign-in', {...data, lastLogin: getUserLastLoginInfo().lastlogin , currentLogin: currentLogin})

  saveWorld(response.data.world, response.data.user); //save world object into Realm Database.

};
