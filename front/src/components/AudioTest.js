import React from 'react';
import { connect } from 'react-redux';
import { getMessage } from '../redux/actions/actions';
import { storage } from '../Firebase';
const audioType = 'audio/webm';


class AudioTest extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      recording: false,
      audios: [],
      speechText: false,
      url: ''
    };
  }


  async componentDidMount() {
    const stream = await navigator.mediaDevices.getUserMedia({ video: false, audio: true });
    this.mediaRecorder = new MediaRecorder(stream, {
      type: 'audio',
      mimeType: audioType
    });
    // init data storage for video chunks
    this.chunks = [];
    // listen for data from media recorder
    this.mediaRecorder.ondataavailable = e => {
      if (e.data && e.data.size > 0) {
        this.chunks.push(e.data);
      }
    };
    this.chunks = [];
    // start recorder with 10ms buffer
    this.mediaRecorder.start(10);

    // start recording speech and convert it to text
    this.recognition = new window.webkitSpeechRecognition();
    this.recognition.continuous = true;
    this.recognition.lang = 'ru-RU, en-US';
    this.recognition.start(10);
    this.recognition.onresult = (event) => {
      for (let i = event.resultIndex; i < event.results.length; ++i) {
        if (event.results[i].isFinal) {
          this.speechToTextMessages.push(event.results[i][0].transcript);
          console.log(this.speechToTextMessages)
        }
      }
    }
    this.speechToTextMessages = [];

    // say that we're recording
    this.setState({ recording: true });
  }

  async componentWillUnmount() {
    this.mediaRecorder.stream.getTracks().forEach(function (track) {
      track.stop();
    });

    this.recognition.stop();
    this.mediaRecorder.stop();
    // say that we're not recording
    this.setState({ recording: false });
    // save the video to memory
    const blob = new Blob(this.chunks, { type: audioType });
    // generate video url from blob
    const audioUrl = window.URL.createObjectURL(blob);

    // append audioUrl to list of saved audios for rendering
    const uploadTask = storage.ref(`audios/${audioUrl}`).put(blob);
    uploadTask.on('state_changed',
      (snapshot) => {
        // progrss function ....
        // const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        // this.setState({ progress });
        console.log(snapshot)
      },
      (error) => {
        // error function ....
        console.log(error);
      },
      () => {
        // complete function ....
        storage.ref('audios').child(audioUrl).getDownloadURL().then(url => {
          this.props.getMessage({ message: url, user: this.props.user, messageType: 'Audio' });
        })
      });
  }

  render() {
    return (
      <div className="camera">
      </div>
    );
  }
}

const mapStateToProps = state => ({
  recording: state.recording,
  user: state.user
})

export default connect(
  mapStateToProps,
  { getMessage }
)(AudioTest);
