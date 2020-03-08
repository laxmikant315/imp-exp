//@ts-ignore
import Speech from 'speak-tts';

// const SpeechNotification: React.FC = (props: any) => {
const speech = new Speech();
speech
  .init({
    volume: 0.5,
    
    rate: 1,
    pitch: 1,
    lang: 'en-US',
    voice: 'Microsoft Zira Desktop - English (United States)',
    // voice:'Google हिन्दी',
    // lang: 'hn-IN',
    
    //'splitSentences': false,
    listeners: {
      onvoiceschanged: (voices: any) => {
        console.log('Voices changed', voices);
      }
    }
  })
  .then((data: any) => {
    console.log('Speech is ready', data);
  })
  .catch((e: any) => {
    console.error('An error occured while initializing : ', e);
  });
const text = speech.hasBrowserSupport()
  ? 'Hurray, your browser supports speech synthesis'
  : 'Your browser does NOT support speech synthesis. Try using Chrome of Safari instead !';

// document.getElementById('support').innerHTML = text;

const getSpeechNotification = (text: any) => {
   
  speech
    .speak({
      text,
      queue: false,
      listeners: {
        onstart: () => {
          console.log('Start utterance');
        },
        onend: () => {
          console.log('End utterance');
        },
        onresume: () => {
          console.log('Resume utterance');
        },
        onboundary: (event: any) => {
          console.log(
            event.name +
              ' boundary reached after ' +
              event.elapsedTime +
              ' milliseconds.'
          );
        }
      }
    })
    .then((data: any) => {
      console.log('Success !', data);
    })
    .catch((e: any) => {
      console.error('An error occurred :', e);
    });
};

export { getSpeechNotification };
