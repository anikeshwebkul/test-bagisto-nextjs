'use client';

import React, { useState } from 'react';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';

const CameraComponent: React.FC = () => {
  const [photo, setPhoto] = useState<string | null>(null);

  const takePhoto = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.Uri,
        source: CameraSource.Camera, // Or CameraSource.Photos for gallery
      });

      if (image && image.webPath) {
        setPhoto(image.webPath);
      }
    } catch (error) {
      console.error('Camera error:', error);
    }
  };

  return (
    <div style={{ textAlign: 'center' }}>
      <button onClick={takePhoto} style={{ padding: '10px 20px', fontSize: 16 }}>
        Take Photo
      </button>

      {photo && (
        <div style={{ marginTop: 20 }}>
          <img src={photo} alt="Taken photo" style={{ maxWidth: '100%', height: 'auto' }} />
        </div>
      )}
    </div>
  );
};

export default CameraComponent;
