import React, {Component} from 'react';
import Clarifai from 'clarifai';
import Navigation from './components/navigation/navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Particles from 'react-particles-js';
import Logo from './components/Logo/Logo';
import './App.css';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';

const app = new Clarifai.App({
 apiKey: '8eacdf372b2149d08a0fcbb0c3dddc1a'
});

const particleOptions ={
  particles: {
    number:{
      value: 30,
      density: {
        enable: true,
        value_area:800
      }
    },
    size:{
      value: 3,
      anim:{
        enable:true
      }
    },
  }
}

class App extends Component {
  constructor(){
    super();
    this.state={
      input:'',
      imageUrl:'',
      box:{},
      route: 'signin',
      isSignedIn: false,
    }
  }

  calculateFaceLocation =(data)=>{
    const clarifaiFace= data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col* width,
      topRow: clarifaiFace.top_row* height,
      rightCol: width-(clarifaiFace.right_col* width),
      bottomRow: height-(clarifaiFace.bottom_row* height),
    }
  }

  displayFaceBox=(box) =>{
    this.setState({box: box});
  }

  onInputChange=(event)=>{
    this.setState({input: event.target.value});
  }

  onButtonSubmit=()=>{
    this.setState({imageUrl: this.state.input});
    app.models
    .predict(
      Clarifai.FACE_DETECT_MODEL,
       this.state.input)
    .then(response => this.displayFaceBox(this.calculateFaceLocation(response)))
    .catch(err => console.log(err));
  }

  onRouteChange=(route)=>{
    if(route=== 'signout') {
      this.setState({isSignedIn: false})
    }else if(route=== 'home') {
      this.setState({isSignedIn: true})      
    }
    this.setState({route:route})
  }

  render(){
    const {imageUrl, box, isSignedIn, route} = this.state
    return (
      <div className="App">
        <Particles className='particles'
          params={particleOptions}
        />
        <Navigation onRouteChange={this.onRouteChange} isSignedIn={isSignedIn} />
        { route === 'home'
          ? <div>
              <Logo />
              <Rank />
              <ImageLinkForm 
                  onInputChange={this.onInputChange}
                  onButtonSubmit={this.onButtonSubmit}
                  />
              <FaceRecognition box={box} imageUrl={imageUrl}/>
            </div>
          : (
            this.state.route ==='register'
            ? <Register onRouteChange={this.onRouteChange} />
            : <Signin onRouteChange={this.onRouteChange} />
            )
            
        }
      </div>
    );
  }
}

export default App;
