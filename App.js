
import React, { useState } from 'react';
import {
  View, Text, Image, ScrollView, TouchableOpacity,
  TextInput, StyleSheet, SafeAreaView, StatusBar
} from 'react-native';

const packages = [
  { id: 1, name: 'Ultimate Adventure Day', price: 1500, image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800', description: 'Explore beautiful outdoor trails.' },
  { id: 2, name: 'Family Explorer', price: 1500, image: 'https://images.unsplash.com/photo-1478131143081-80f7f84ca84d?w=800', description: 'An adventure for the whole family.' },
  { id: 3, name: 'Mountain Escape', price: 1500, image: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=800', description: 'Discover breathtaking mountains.' },
  { id: 4, name: 'Corporate Team Challenge', price: 1500, image: 'https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=800', description: 'Build teamwork outdoors.' }
];

const activities = [
  { id: 5, name: 'Ziplining', price: 750, image: 'https://images.unsplash.com/photo-1530789253388-582c481c54b0?w=800', description: 'Experience the thrill of ziplining.' },
  { id: 6, name: 'Kayaking', price: 750, image: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=800', description: 'Enjoy an exciting water adventure.' },
  { id: 7, name: 'Rock Climbing', price: 750, image: 'https://images.unsplash.com/photo-1522163182402-834f871fd851?w=800', description: 'Challenge yourself.' }
];

const allItems = [...packages, ...activities];

export default function App() {
  const [page, setPage] = useState('Home');
  const [saved, setSaved] = useState([]);
  const [selected, setSelected] = useState([]);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [quote, setQuote] = useState(null);

  const money = value => 'R' + value.toFixed(2);

  function toggleSaved(id) {
    setSaved(old =>
      old.includes(id) ? old.filter(x => x !== id) : [...old, id]
    );
  }

  function toggleSelected(id) {
    setSelected(old =>
      old.includes(id) ? old.filter(x => x !== id) : [...old, id]
    );
    setQuote(null);
  }

  function calculateQuote() {
    if (!name.trim() || !email.includes('@') || selected.length === 0) {
      alert('Enter your name, a valid email and select an experience.');
      return;
    }

    const items = allItems.filter(x => selected.includes(x.id));
    const subtotal = items.reduce((sum, x) => sum + x.price, 0);
    const rate = selected.length >= 4 ? .15 :
      selected.length === 3 ? .10 :
      selected.length === 2 ? .05 : 0;

    const discount = subtotal * rate;
    const vat = (subtotal - discount) * .15;

    setQuote({
      items, subtotal, discount, vat,
      total: subtotal - discount + vat
    });
  }

  function Card({ item }) {
    return (
      <View style={styles.card}>
        <Image source={{ uri: item.image }} style={styles.cardImage} />
        <View style={styles.cardBody}>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.description}>{item.description}</Text>
          <Text style={styles.price}>{money(item.price)} / person</Text>
          <View style={styles.actions}>
            <TouchableOpacity
              style={styles.save}
              onPress={() => toggleSaved(item.id)}
            >
              <Text>{saved.includes(item.id) ? '♥ Saved' : '♡ Save'}</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.orangeButton}
              onPress={() => {
                setSelected(old => old.includes(item.id) ? old : [...old, item.id]);
                setQuote(null);
                setPage('Quote');
              }}
            >
              <Text style={styles.whiteText}>Get quote</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }

  function Heading({ children }) {
    return <Text style={styles.heading}>{children}</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0A2540" />

      <View style={styles.header}>
        <Text style={styles.logo}>Adventure <Text style={{color:'#E85D04'}}>Escape</Text> SA</Text>
        <Text style={{fontSize:23}}>🌿</Text>
      </View>

      <ScrollView contentContainerStyle={{paddingBottom:25}}>

        {page === 'Home' && (
          <>
            <Image
              source={{uri:'https://images.unsplash.com/photo-1448375240586-882707db888b?w=1000'}}
              style={styles.heroImage}
            />
            <View style={styles.heroContent}>
              <Text style={styles.eyebrow}>ADVENTURE ESCAPE SOUTH AFRICA</Text>
              <Text style={styles.heroTitle}>Discover. Explore. Escape.</Text>
              <Text style={styles.heroDescription}>
                Experience the beauty of outdoor adventures.
                Your next unforgettable journey starts here.
              </Text>
              <TouchableOpacity style={styles.orangeButton}
                onPress={() => setPage('Packages')}>
                <Text style={styles.whiteText}>Explore packages →</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.section}>
              <Heading>Featured adventures</Heading>
              {packages.slice(0,2).map(x => <Card key={x.id} item={x}/>)}
            </View>
          </>
        )}

        {page === 'Packages' && (
          <View style={styles.section}>
            <Heading>Our Packages</Heading>
            <Text style={styles.description}>Choose your perfect adventure.</Text>
            {packages.map(x => <Card key={x.id} item={x}/>)}
          </View>
        )}

        {page === 'Activities' && (
          <View style={styles.section}>
            <Heading>Our Activities</Heading>
            <Text style={styles.description}>Add more excitement to your day.</Text>
            {activities.map(x => <Card key={x.id} item={x}/>)}
          </View>
        )}

        {page === 'Saved' && (
          <View style={styles.section}>
            <Heading>Saved Experiences</Heading>
            {allItems.filter(x => saved.includes(x.id)).length === 0
              ? <Text style={styles.description}>You have no saved experiences yet.</Text>
              : allItems.filter(x => saved.includes(x.id)).map(x =>
                <Card key={x.id} item={x}/>
              )}
          </View>
        )}

        {page === 'Quote' && (
          <View style={styles.section}>
            <Heading>Get an Instant Quote</Heading>
            <Text style={styles.description}>Tell us about your adventure.</Text>

            <Text style={styles.label}>Full name</Text>
            <TextInput style={styles.input} placeholder="Your name"
              value={name} onChangeText={setName}/>

            <Text style={styles.label}>Email address</Text>
            <TextInput style={styles.input} placeholder="Your email"
              keyboardType="email-address" autoCapitalize="none"
              value={email} onChangeText={setEmail}/>

            <Heading>Select Experiences</Heading>

            {allItems.map(item => (
              <TouchableOpacity key={item.id}
                style={styles.option}
                onPress={() => toggleSelected(item.id)}>
                <Text style={{fontSize:20}}>
                  {selected.includes(item.id) ? '☑' : '☐'}
                </Text>
                <Text style={{flex:1}}>{item.name}</Text>
                <Text style={styles.price}>{money(item.price)}</Text>
              </TouchableOpacity>
            ))}

            <TouchableOpacity style={styles.orangeButton}
              onPress={calculateQuote}>
              <Text style={styles.whiteText}>Calculate my quote</Text>
            </TouchableOpacity>

            {quote && (
              <View style={styles.quoteBox}>
                <Heading>Your Quote</Heading>
                {quote.items.map(x =>
                  <Text key={x.id} style={styles.quoteLine}>
                    {x.name}: {money(x.price)}
                  </Text>
                )}
                <Text style={styles.quoteLine}>Subtotal: {money(quote.subtotal)}</Text>
                <Text style={styles.quoteLine}>Discount: -{money(quote.discount)}</Text>
                <Text style={styles.quoteLine}>VAT (15%): {money(quote.vat)}</Text>
                <Text style={styles.total}>Total: {money(quote.total)}</Text>
                <Text style={styles.description}>This is an estimated quote, not a confirmed booking.</Text>
              </View>
            )}
          </View>
        )}

        {page === 'About' && (
          <View style={styles.section}>
            <Image source={{uri:'https://images.unsplash.com/photo-1472396961693-142e6e269027?w=900'}}
              style={styles.aboutImage}/>
            <Heading>About Adventure Escape SA</Heading>
            <Text style={styles.description}>
              Adventure Escape SA connects people with exciting outdoor
              experiences in South Africa.
            </Text>
            <Heading>Our Vision</Heading>
            <Text style={styles.description}>
              To become a trusted destination for outdoor adventures.
            </Text>
            <Heading>Our Mission</Heading>
            <Text style={styles.description}>
              To make discovering outdoor experiences simple and memorable.
            </Text>
            <Heading>Contact Us</Heading>
            <Text style={styles.description}>hello@adventureescapesa.co.za</Text>
          </View>
        )}
      </ScrollView>

      <View style={styles.nav}>
        {[
          ['Home','⌂'], ['Packages','▲'], ['Activities','♧'],
          ['Quote','R'], ['Saved','♡'], ['About','i']
        ].map(([label, icon]) => (
          <TouchableOpacity key={label}
            style={styles.navItem}
            onPress={() => setPage(label)}>
            <Text style={{fontSize:19,color:page===label?'#E85D04':'#FFF6DC'}}>
              {icon}
            </Text>
            <Text style={{fontSize:10,color:page===label?'#E85D04':'#FFF6DC'}}>
              {label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,backgroundColor:'#FFFDF8'},
  header:{
    backgroundColor:'#0A2540',padding:17,
    flexDirection:'row',justifyContent:'space-between',
    alignItems:'center'
  },
  logo:{fontSize:21,fontWeight:'bold',color:'#FFF6DC'},
  heroImage:{width:'100%',height:250},
  heroContent:{backgroundColor:'#0A2540',padding:23},
  eyebrow:{color:'#E85D04',fontWeight:'bold',fontSize:11},
  heroTitle:{fontSize:37,fontWeight:'bold',color:'#FFF6DC',marginVertical:12},
  heroDescription:{color:'#FFF6DC',fontSize:15,lineHeight:23,marginBottom:15},
  section:{padding:17},
  heading:{fontSize:25,fontWeight:'bold',color:'#0A2540',marginVertical:12},
  description:{fontSize:14,color:'#5B6570',lineHeight:22,marginBottom:10},
  card:{
    backgroundColor:'white',borderRadius:17,overflow:'hidden',
    marginVertical:12,borderWidth:1,borderColor:'#EADFB E'.replace(' ','')
  },
  cardImage:{width:'100%',height:180},
  cardBody:{padding:15},
  cardTitle:{fontSize:21,fontWeight:'bold',color:'#0A2540'},
  price:{color:'#1F6B2C',fontWeight:'bold'},
  actions:{flexDirection:'row',marginTop:12,alignItems:'center'},
  save:{backgroundColor:'#FFF6DC',padding:12,borderRadius:20,marginRight:8},
  orangeButton:{backgroundColor:'#E85D04',padding:14,borderRadius:25,alignItems:'center',marginVertical:8},
  whiteText:{color:'white',fontWeight:'bold'},
  input:{borderWidth:1,borderColor:'#EADFB E'.replace(' ',''),borderRadius:10,padding:14,marginVertical:8,backgroundColor:'white'},
  label:{fontWeight:'bold',color:'#0A2540'},
  option:{flexDirection:'row',alignItems:'center',padding:13,borderWidth:1,borderColor:'#EADFB E'.replace(' ',''),borderRadius:10,marginVertical:5,gap:8},
  quoteBox:{backgroundColor:'#0A2540',padding:18,borderRadius:15,marginTop:20},
  quoteLine:{color:'#FFF6DC',marginVertical:6},
  total:{color:'#E85D04',fontSize:23,fontWeight:'bold',marginTop:12},
  aboutImage:{width:'100%',height:220,borderRadius:15},
  nav:{flexDirection:'row',justifyContent:'space-around',backgroundColor:'#0A2540',paddingVertical:10,paddingBottom:12},
  navItem:{alignItems:'center',flex:1}
});
