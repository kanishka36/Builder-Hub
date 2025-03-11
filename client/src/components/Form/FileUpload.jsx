import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { toast } from "react-toastify";
import { storage } from "../../firebase";

const FileUpload = ({ name, label, multiple = true, onUploadComplete }) => {
  const [imageURLs, setImageURLs] = useState([]);
  const [fileUploadErrors, setFileUploadErrors] = useState([]);
  const [uploadProgress, setUploadProgress] = useState({});

  const onDrop = useCallback(
    (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        setFileUploadErrors([]);
        if (!multiple) {
          setImageURLs([]); // Reset previous image if single upload mode
        }
        acceptedFiles.forEach(uploadImageToFirebase);
      } else {
        setFileUploadErrors(["Invalid file type. Please upload an image."]);
      }
    },
    [multiple]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    multiple,
  });

  const uploadImageToFirebase = async (file) => {
    try {
      const fileName = `${new Date().getTime()}_${file.name}`;
      const storageRef = ref(storage, fileName);
      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress((prev) => ({
            ...prev,
            [fileName]: Math.round(progress),
          }));
        },
        (error) => {
          setFileUploadErrors((prev) => [
            ...prev,
            `Failed to upload ${file.name}`,
          ]);
          console.error("Upload error:", error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setImageURLs((prev) => {
            const newURLs = multiple ? [...prev, downloadURL] : [downloadURL];
            if (onUploadComplete) {
              onUploadComplete(newURLs);
            }
            return newURLs;
          });

          setUploadProgress((prev) => {
            const newProgress = { ...prev };
            delete newProgress[fileName];
            return newProgress;
          });

          toast.success(`Image uploaded successfully`, {
            position: "top-center",
            autoClose: 1500,
          });
        }
      );
    } catch (error) {
      console.error("Firebase upload error:", error);
      setFileUploadErrors((prev) => [
        ...prev,
        "Image upload failed. Please try again.",
      ]);
    }
  };

  const handleRemoveImg = (index) => {
    setImageURLs((prev) => {
      const newURLs = prev.filter((_, i) => i !== index);
      if (onUploadComplete) {
        onUploadComplete(newURLs);
      }
      return newURLs;
    });
  };

  return (
    <>
      <div className="mt-4">
        {label && <label className="label-style">{label}</label>}
        <div
          {...getRootProps()}
          className={`mt-2 p-6 border-2 border-dashed rounded-lg cursor-pointer ${
            isDragActive
              ? "border-blue-400 bg-white"
              : "border-gray-500 bg-white"
          }`}
        >
          <input {...getInputProps()} />
          <div className="text-center text-gray-300">
            <p>
              Drag & drop {multiple ? "images" : "an image"} here, or click to
              select
            </p>
          </div>
        </div>

        {Object.keys(uploadProgress).map((fileName) =>
          uploadProgress[fileName] < 100 ? (
            <p key={fileName} className="text-sm text-blue-400 mt-2">
              Uploading {uploadProgress[fileName]}%
            </p>
          ) : null
        )}

        {imageURLs.length > 0 && (
          <div
            className={`mt-4 grid ${
              multiple ? "grid-cols-5 gap-1" : "grid-cols-1"
            }`}
          >
            {imageURLs.map((url, index) => (
              <div key={index} className="relative w-[50%]">
                <img
                  src={url}
                  alt="Preview"
                  className="object-cover rounded-lg"
                />
                <div className="absolute top-0 right-0 m-2">
                  <button
                    onClick={() => handleRemoveImg(index)}
                    className="bg-red-500 text-white px-2 py-1 rounded"
                  >
                    X
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {fileUploadErrors.length > 0 &&
          fileUploadErrors.map((error, index) => (
            <p key={index} className="text-red-500 text-sm mt-2">
              {error}
            </p>
          ))}
      </div>
    </>
  );
};

export default FileUpload;
