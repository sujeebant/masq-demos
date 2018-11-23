import React from 'react'

const Profiles = ({ profiles, onClick }) => (
  <div className='Profiles'>
    {profiles.map(profile => (
      <span className='profile' key={profile.id} onClick={() => onClick(profile)}>
        <img src={profile.image} alt={profile.username} />
        <span key={profile.id}>{profile.username}</span>
      </span>
    ))}
  </div>
)

export default Profiles
