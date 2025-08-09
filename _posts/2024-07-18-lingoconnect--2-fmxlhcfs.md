---
title: "[LingoConnect] 개발2"
description: "이번 프로젝트의 핵심은 생성형 AI와 Audio file이다."
date: 2024-07-18T09:45:26.745Z
tags: ["프로젝트"]
slug: "LingoConnect-개발2-fmxlhcfs"
series:
  id: f1c772f1-a5a9-4a12-ae8d-d10149c9e876
  name: "프로젝트"
velogSync:
  lastSyncedAt: 2025-08-09T03:04:03.604Z
  hash: "2491780ee0dd70127be2debb11ab40d4d940ebcf0689d9f13c6df8b17cd4a78e"
---


## Wav, Pcm
frontend에서 보내는 wav 파일을, java backend server로 받아서 pcm 파일로 변경해야 한다.

wav 파일을 서버에 저장하는 것까지는 잘 되었는데, pcm 파일로 변환할 때 계속 오류가 발생했다.
```
javax.sound.sampled.UnsupportedAudioFileException: File of unsupported format
```

아래는 사용한 java 코드이다. 
```java
public static void convertWavToPcm(File wavFile, File pcmFile, AudioFormat pcmFormat) throws IOException, UnsupportedAudioFileException {
    try (AudioInputStream wavAudioStream = AudioSystem.getAudioInputStream(wavFile);
         AudioInputStream pcmAudioStream = AudioSystem.getAudioInputStream(pcmFormat, wavAudioStream);
         ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
         FileOutputStream fileOutputStream = new FileOutputStream(pcmFile)) {

        // Read the converted PCM audio stream and write it to the output stream
        byte[] buffer = new byte[1024];
        int bytesRead;
        while ((bytesRead = pcmAudioStream.read(buffer)) != -1) {
            byteArrayOutputStream.write(buffer, 0, bytesRead);
        }

        // Convert the byte array output stream to byte array
        byte[] audioBytes = byteArrayOutputStream.toByteArray();

        // Write the byte array to the output file
        fileOutputStream.write(audioBytes);
    }
}
```

<br>

```AudioSystem``` 객체의 메소드를 실행하면 항상 ```UnsupportedAudioFileException```이 발생했다. 

>#### 이상한 점!!!
인터넷에서 다운받은 일반 wav 파일은 오류 없이 pcm 파일로 잘 변환되었다.
즉, 프론트에서 전달받은 wav 파일을 변환할 때만 오류가 발생한 것이다.


필자가 생각한 원인은 다음과 같다.

1. 프론트에서 보내는 wav 파일의 포맷이 ```AudioSystem```에서 지원하는 wav 파일의 포맷과 다르다.
2. 또는, 프론트의 wav 파일에 오류가 있다.

하지만, wav 파일 자체에는 손상이 없는 것 같았다. 그 이유는, wav 파일 자체를 저장한 다음에 재생시키는 것은 잘 동작했기 때문이다.

그럼 프론트에서 보내는 wav 파일의 포맷을 고치면 잘 작동하지 않을까?

<br>

### 해결방법
필자가 생각한 해결방법은 2가지이다.

1. 프론트의 wav 파일 포맷을 standard로 직접 지정
2. 백엔드에서 ```AudioSystem```을 사용하지 않고 wav->pcm 변환

>결론적으로 두 방법 다 잘 작동하는 것 같다.

#### 1. 프론트 고치기

프론트의 코드를 한 번 살펴보자.

```javascript
    const onSubmitAudioFile = useCallback(async () => {
        if (audioUrl) {
            try {
                const response = await fetch(audioUrl);
                const blob = await response.blob();
                const sound = new File([blob], "soundBlob.wav", { lastModified: new Date().getTime(), type: "audio/wav" });

                const question = Questions[currentQuestionIndex];
                const formData = new FormData();
                formData.append('audio', sound);

                const audioResponse = await getAudioFeedback(formData);
                if (audioResponse.status === 200) {
                    const data = await audioResponse.json();
                    console.log(data);
                } else {
                    console.log("Error:", audioResponse.status);
                }
            } catch (error) {
                console.error('Error submitting audio file:', error);
            }
        }
    }, [audioUrl, Questions, currentQuestionIndex, topic]);
```
위의 코드는 wav 파일을 생성해서 formData에 넣는 과정을 포함하고 있다.
서버에 전송하는 코드는 첨부하지 않았다.

위의 코드에서는 wav 파일의 포맷을 특별히 지정해주지는 않았다.
아래 코드는 wav 파일의 포맷을 standard로 직접 지정하는 코드이다.
```javascript
const onSubmitAudioFile = useCallback(async () => {
    if (audioUrl) {
        try {
            const response = await fetch(audioUrl);
            const blob = await response.blob();
            
            const wavBlob = await convertBlobToWav(blob);

            const sound = new File([wavBlob], "soundBlob.wav", { lastModified: new Date().getTime(), type: "audio/wav" });

            const question = Questions[currentQuestionIndex];
            const formData = new FormData();
            formData.append('audio', sound);

            const audioResponse = await getAudioFeedback(formData);
            if (audioResponse.status === 200) {
                const data = await audioResponse.json();
                console.log(data);
            } else {
                console.log("Error:", audioResponse.status);
            }
        } catch (error) {
            console.error('Error submitting audio file:', error);
        }
    }
}, [audioUrl, Questions, currentQuestionIndex, topic]);

const convertBlobToWav = async (blob) => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
    const arrayBuffer = await blob.arrayBuffer();
    const audioBuffer = await audioContext.decodeAudioData(arrayBuffer);

    const numberOfChannels = audioBuffer.numberOfChannels;
    const length = audioBuffer.length * numberOfChannels * 2 + 44;
    const buffer = new ArrayBuffer(length);
    const view = new DataView(buffer);

    // Write WAV header
    writeString(view, 0, 'RIFF');
    view.setUint32(4, 36 + audioBuffer.length * numberOfChannels * 2, true);
    writeString(view, 8, 'WAVE');
    writeString(view, 12, 'fmt ');
    view.setUint32(16, 16, true);
    view.setUint16(20, 1, true);
    view.setUint16(22, numberOfChannels, true);
    view.setUint32(24, 16000, true); // sampleRate = 16000
    view.setUint32(28, 16000 * 2 * numberOfChannels, true); // byteRate = sampleRate * blockAlign
    view.setUint16(32, numberOfChannels * 2, true); // blockAlign = numberOfChannels * bytesPerSample
    view.setUint16(34, 16, true); // bitsPerSample
    writeString(view, 36, 'data');
    view.setUint32(40, audioBuffer.length * numberOfChannels * 2, true);

    // Write PCM samples
    const offset = 44;
    for (let i = 0; i < audioBuffer.length; i++) {
        for (let channel = 0; channel < numberOfChannels; channel++) {
            const sample = audioBuffer.getChannelData(channel)[i];
            const intSample = sample < 0 ? sample * 32768 : sample * 32767; // Convert sample to 16-bit PCM
            view.setInt16(offset + (i * numberOfChannels + channel) * 2, intSample, true);
        }
    }

    return new Blob([buffer], { type: 'audio/wav' });
};

const writeString = (view, offset, string) => {
    for (let i = 0; i < string.length; i++) {
        view.setUint8(offset + i, string.charCodeAt(i));
    }
};
```

잘 작동한다.

> #### 만약 ETRI 발음평가를 사용한다면
반드시 sampling Rate를 16k로 맞춰야 한다.
백엔드뿐만 아니라 녹음할 때도 16k로 맞춰줘야 한다.

```javascript    
const audioContext = new (window.AudioContext || window.webkitAudioContext)({ sampleRate: 16000 });
```
sampling rate와 연관된 코드이다!
주의하도록 하자.

<br>

#### 2. 백엔드 고치기
백엔드에서 ```AudioSystem```을 사용하지 않고 wav 파일을 pcm 파일로 변환했다.
wav 파일에서 헤더를 뺀 것이 pcm 파일(raw 파일)이기 때문에, 수동으로 헤더를 제거하면 된다.

```java
public static void convertWavToPcm(File wavFile, File pcmFile) throws IOException {
    try (FileInputStream wavStream = new FileInputStream(wavFile);
         FileOutputStream pcmStream = new FileOutputStream(pcmFile)) {

        byte[] header = new byte[44];
        if (wavStream.read(header) != 44) {
            throw new IOException("Invalid WAV file header");
        }

        // Extract the number of channels, sample rate, and bits per sample
        int channels = ByteBuffer.wrap(header, 22, 2).order(ByteOrder.LITTLE_ENDIAN).getShort();
        int sampleRate = ByteBuffer.wrap(header, 24, 4).order(ByteOrder.LITTLE_ENDIAN).getInt();
        int bitsPerSample = ByteBuffer.wrap(header, 34, 2).order(ByteOrder.LITTLE_ENDIAN).getShort();

        System.out.println("Channels: " + channels);
        System.out.println("Sample Rate: " + sampleRate);
        System.out.println("Bits Per Sample: " + bitsPerSample);

        // Calculate the byte rate and block align
        int byteRate = sampleRate * channels * bitsPerSample / 8;
        int blockAlign = channels * bitsPerSample / 8;

        System.out.println("Byte Rate: " + byteRate);
        System.out.println("Block Align: " + blockAlign);

        // Skip the rest of the header and extract the PCM data
        byte[] buffer = new byte[1024];
        int bytesRead;
        while ((bytesRead = wavStream.read(buffer)) != -1) {
            pcmStream.write(buffer, 0, bytesRead);
        }
    }
}
```

일단 wav 파일의 첫 44bytes를 읽어서 ```header``` 에 저장한다.
이때, ```wavStream``` 의 오프셋은 헤더 바로 뒤에 위치한다.
한번 더 ```wavStream```을 읽어서 ```pcmStream```에 write하면 헤더만 뺀 raw 파일, 즉 pcm 파일을 얻을 수 있다.




