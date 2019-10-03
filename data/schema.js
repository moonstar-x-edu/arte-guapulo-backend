// How the data would look like.

const schema = {
  image: "https://cdn.example.com/img/uuid.png",
  coordinates: {
    latitude: "00'00'00",
    longitude: "00'00'00"
  },
  authors: [
    {
      facebook: null,
      twitter: null,
      instagram: 'artist.handle'
    },
    {
      facebook: 'second.artist',
      twitter: 'they.also.have.twitter',
      instagram: null
    }
  ],
  tags: [
    'type',
    'author',
    'location',
    'other1',
    'other2'
  ]
};

export default schema;
