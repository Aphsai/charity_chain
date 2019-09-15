import { db } from './firebase';

// User API

export const doAppendToAggregateDonations = (uid, donations) => {
  return db.ref(`charities/${uid}/aggregate_donations`).once('value')
    .then(snapshot => {
      let current_aggregate_donations = snapshot.val();
      Object.keys(donations).forEach((elem) => {
        if (current_aggregate_donations[elem]) {
          current_aggregate_donations[elem] += donations[elem];
        } else {
          current_aggregate_donations[elem] = donations[elem];
        }
      })
      db.ref(`charities/${uid}/aggregate_donations`).set(current_aggregate_donations);
      return current_aggregate_donations;
    });
}

export const getListOfUsers = () => {
  return db.ref('users').once('value')
    .then(snapshot => {
      return snapshot.val();
    });
}

export const getSpecificUser = (uid) => {
  return db.ref(`users/${uid}`).once('value')
    .then(snapshot => {
      return snapshot.val();
    });
}

export const getRefOfCharities = () => {
  return db.ref('charities').once('value')
    .then(snapshot => {
      return snapshot.val();
    });
}

export const getSpecificCharity = (uid) => {
  return db.ref(`charities/${uid}`).once('value')
    .then(snapshot => {
      return snapshot.val();
    });
}

export const addTransactionToUser = (uid, public_id) =>
  db.ref(`users/${uid}/transaction/${public_id}`).push(public_id);

export const getRefOfTransactions = (uid) => {
  return db.ref(`users/${uid}/transaction`).once('value')
    .then(snapshot => {
      return snapshot.val();
    });
}

export const consumeTransactionFromUser = (uid, public_id) =>
  db.ref(`users/${uid}/consumed_transaction/${public_id}`).push(public_id);

export const getRefOfConsumedTransactions = (uid) => {
  return db.ref(`users/${uid}/consumed_transaction`).once('value')
    .then(snapshot => {
      return snapshot.val();
    });
}

export const incrementDonation = (uid) => {
  const dbRef = db.ref(`charities/${uid}/donation_count`);
  dbRef.transaction(donation_count => {
    if(donation_count || donation_count === 0) {
      donation_count = donation_count + 1;
    }
    return donation_count;
  });
}

export const doCreateCharity = (id, account_number, email, category, image, donation_count = 0) =>
  db.ref('charities').push({
    public_id: id,
    account_number,
    email,
    category,
    image,
    donation_count
  });

export const doCreateUser = (id, username, email) => {
  let favourites = {placeholder: 'empty_child'};
  let uploaded = {placeholder: 'empty_child'}
  let upvoted = {placeholder: 'empty_child'}
  return db.ref(`users/${id}`).set({
    favourites,
    uploaded,
    upvoted,
    username,
    email,
  });
}
