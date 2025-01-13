# TuneSynth AI Engine

The TuneSynth AI Engine is a user-friendly music generation and processing platform designed to create, remix, and isolate music tracks. Designed for both novices and seasoned producers, it simplifies complex workflows, allowing users to focus on creativity. By providing text-based prompts that describe music style, mood, or theme, users can generate customized compositions. These prompts are processed using models, including those for instrumental separation like Demucs, to create tailored musical outputs.

The front-end is built with React, offering an interactive interface, while the back-end, powered by Flask, handles the heavy computational tasks. The system integrates APIs, including Hugging Face, for efficient audio generation and processing. It allows users to upload audio files, generate MP3 outputs, and separate instrumental tracks, providing seamless music production and remixing features.

By utilizing cloud-hosted APIs for computational tasks, TuneSynth minimizes hardware dependencies and ensures compatibility across devices. Its modular design supports future feature integration and scalability, allowing for a wide range of music production tasks. With optimized performance and error handling, TuneSynth provides an efficient and reliable platform for both educational and professional environments, simplifying the music-making process and expanding creative possibilities.

## Key Features
- **AI-Driven Music Creation**: Generate original compositions using text-based prompts.
- **Instrumental Separation**: Isolate instrumental tracks from existing audio using advanced models like Demucs.
- **User-Friendly Interface**: Interactive React-based front-end for seamless user experience.
- **Robust Back-End**: Flask-based back-end for handling heavy computational tasks.
- **Cloud Integration**: Minimizes hardware dependencies and ensures cross-device compatibility.
- **Modular Design**: Supports future feature additions and scalability.

## Installation Guide
### Prerequisites
1. Python 3.x
2. Node.js and npm
3. Virtual Environment (venv)

### Steps
1. **Set up Python Environment**:
   - Navigate to the project directory.
   - Create a virtual environment:
     ```bash
     python -m venv venv
     ```
   - Activate the virtual environment:
     - On Windows:
       ```bash
       venv\Scripts\activate
       ```
     - On macOS/Linux:
       ```bash
       source venv/bin/activate
       ```
   - Install dependencies:
     ```bash
     pip install -r ./requirements.txt
     ```

2. **Set up Front-End**:
   - Navigate to the front-end directory:
     ```bash
     cd TuneSynthAI/front-end
     ```
   - Install npm packages:
     ```bash
     npm install
     ```

### Running the Application
1. **Start Back-End Servers**:
   - For music generation:
     ```bash
     python TuneSynthAI/back-end/music_generation.py
     ```
   - For instrumental separation:
     ```bash
     python TuneSynthAI/back-end/audio_separation.py
     ```
   **Important Note**: Only one Python server can run at a time.

2. **Start Front-End Server**:
   - Navigate to the front-end directory:
     ```bash
     cd TuneSynthAI/front-end
     ```
   - Start the npm server:
     ```bash
     npm start
     ```

## Credits
**Guide:**  
Prof. Padma Prasada  
Assistant Professor  
SDMIT, Ujire  

**Created By:**
- Gurunath Malagar (USN: 4SU21AD020)
- Samartha J (USN: 4SU21AD040)
- Shreyas V (USN: 4SU21AD049)
- Supritha D (USN: 4SU21AD055)

## Contact
For any queries, contact:  
**Email:** jsamarth505@gmail.com

