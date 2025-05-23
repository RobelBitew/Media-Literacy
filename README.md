# Media-Literacy

- Extracts texts such as captions and comments from posts
- popup display to show text
- Use on Instagram and X for now

## Steps to use extension for Microsoft Edge

1. clone repo
2. Go to edge://extensions/ and turn on Developer mode (found on the right column)
3. click Load unpacked and select the folder containing the git files you cloned
4. now the extension can be found on the toolbar. click scan to see texts from user posts

## may run into problems

- if you can't scan any texts then right click on page and click inspect.
- refresh the page to see that script is running, then try scan again

Run llm.py:
- pip install openai
- python llm.py
## we are unable to add the openai api key to this github for security reasons
## we had been attempting to connect llm.py and popup.js but are still in the debugging phase

## Steps to run backend
- pip install -r requirements.txt
- Then from FastAPI/app dir. run uvicorn main:app --reload
    ## Optional
    - Navigate to http://127.0.0.1:8000/docs to view endpoints
