import openai

# this API key is set to Adrian's account... it has $5 on it for prompting...
openai.api_key = "not_the_real_key"

hardcoded_text_from_post = "@RealDonaldTrump For many years the World has wondered why Prescription Drugs and Pharmaceuticals in the United States States of America were SO MUCH HIGHER IN PRICE THAN THEY WERE IN ANY OTHER NATION, SOMETIMES BEING FIVE TO TEN TIMES MORE EXPENSIVE THAN THE SAME DRUG, MANUFACTURED IN THE EXACT SAME LABORATORY OR PLANT, BY THE SAME COMPANY??? It was always difficult to explain and very embarrassing because, in fact, there was no correct or rightful answer. The Pharmaceutical/Drug Companies would say, for years, that it was Research and Development Costs, and that all of these costs were, and would be, for no reason whatsoever, borne by the 'suckers' of America, ALONE. Campaign Contributions can do wonders, but not with me, and not with the Republican Party. We are going to do the right thing, something that the Democrats have fought for many years. Therefore, I am pleased to announce that Tomorrow morning, in the White House, at 9:00 A.M., I will be signing one of the most consequential Executive Orders in our Country's history. Prescription Drug and Pharmaceutical prices will be REDUCED, almost immediately, by 30% to 80%. They will rise throughout the World in order to equalize and, for the first time in many years, bring FAIRNESS TO AMERICA! I will be instituting a MOST FAVORED NATION'S POLICY whereby the United States will pay the same price as the Nation that pays the lowest price anywhere in the World. Our Country will finally be treated fairly, and our citizens Healthcare Costs will be reduced by numbers never even thought of before. Additionally, on top of everything else, the United States will save TRILLIONS OF DOLLARS. Thank you for your attention to this matter. MAKE AMERICA GREAT AGAIN!"
guidelines = "You are a neutral assistant to aid with political polarization." \
"Read the text and format the output as such: [Username]\nEmotion: [emotion elicted from the text]\n" \
"Ingroup: [Ingroup of the text]\nOutgroup: [outgroup of the text]\n" \
"Reflective question: [pose a neutral, reflective question on the text to encourage social media users" \
"to consider diverse viewpoints]"

response = openai.ChatCompletion.create(
    model="gpt-3.5-turbo",
    messages=[
        {"role": "system", "content": guidelines},
        {"role": "user", "content": hardcoded_text_from_post}
    ],
    temperature=0.8,
    max_tokens=100
)

reply = response['choices'][0]['message']['content'].strip()
print("Media Literacy AI:", reply)
