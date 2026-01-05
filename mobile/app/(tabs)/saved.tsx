import React from 'react';
import { Text, View, StyleSheet, SectionList } from 'react-native';
/*only can see IF logged in*/

export default function SavedRecipes() {
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Here are your saved recipes:</Text>
            {/*saved recipes listed here*/}
            <SectionList sections={[
                {title: 'F', data: ['frangipane']},
                {title: 'L', data: ['lingiune', 'lettuce']}
            ]}
            renderItem={({item})=><Text style={styles.item}>{item}</Text>}
        renderSectionHeader={({section}) => (
          <Text style={styles.sectionHeader}>{section.title}</Text>
        )}
        keyExtractor={item => `basicListEntry-${item}`}

            />
        </View>
        /*
        if not logged in & if can see this page, prompt users to login/register 
        <View>  
            <Text>Login to check your fave recipes</Text> 
            <Text>First time using Pantry Wizard? Register an account and save your recipes!</Text> 
        </View>*/
    );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 22,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "600",
  },
  sectionHeader: {
    paddingTop: 2,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 2,
    fontSize: 14,
    fontWeight: 'bold',
    backgroundColor: 'rgba(247,247,247,1.0)',
  },
  item: {
    fontSize: 18,
    height: 44,
  }
});
