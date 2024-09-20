import { useState, useEffect } from 'react';
import toast, { Toaster } from "react-hot-toast"; 
import Loader from '../components/Loader/Loader';
import SearchBar from '../components/SearchBar/SearchBar';
import ImageGallery from '../components/ImageGallery/ImageGallery';
import { getPhotos } from '../images-api';
import './App.css';
import ErrorMessage from '../components/ErrorMessage/ErrorMessage';
import LoadMoreBtn from '../components/LoadMoreBtn/LoadMoreBtn';
import ImageModal from '../components/ImageModal/ImageModal';
import { Modal, Image, Response} from '../types';
function App() {
  const [images, setImages] = useState<Image[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string|null>(null)
  const [page, setPage] = useState<number>(1)
  const [query, setQuery] = useState<string>('')
  const [isEmpty, setIsEmpty] = useState<boolean>(false)
  const [nextPage, setNextPage] = useState<boolean>(false)
  const [modal, setModal] = useState<Modal>({ isOpen: false, imgUrl: "", imgAlt: "" });
  
  const handleSubmit = (searchValue: string): void => {
    setQuery(searchValue);
    setImages([]);
    setPage(1);
    setError(null);
    setIsEmpty(false);
    setNextPage(false);
  }
  useEffect(() => {
    if (!query) {
      return;
    }
    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);
      try {
        const { results, total, total_pages }: Response = await getPhotos(query, page);
        
        if (!total) {
          setIsEmpty(true);
          console.log('No images found');
          const notify = () => toast.error('Sorry, there are no images matching your search query. Please try again.', {
            position: "top-center",
            duration: 3000,
            style: { marginTop: 110 }
          
          });
          notify();
        }
        
      
        setImages((prevImages) => [...prevImages, ...results]);
        setNextPage(page < total_pages)
      } catch (error) {
        setError((error as Error).message);
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [query, page]);

  const handleLoadMoreClick = (): void => {
    setPage((prevPage) => prevPage + 1);
  }
  const openModal = (url: string, alt: string): void => {
    setModal({ ...modal, isOpen: true, imgUrl: url, imgAlt: alt });
  };
  const closeModal = (): void => {
    setModal({ ...modal, isOpen: false, imgUrl: "", imgAlt: "" && "noAlt" });
  };
    
  return (
    <>
      <h1>Photos</h1>
      <SearchBar onSubmit={handleSubmit} />
      {images.length > 0 && (<ImageGallery images={images} openModal={openModal} />)}
            
      {loading && <Loader />}
      {error && <ErrorMessage message={error} />}
      {/* {modal && <ImageModal image={modal} onClose={closeModal} />} */}
      {nextPage && <LoadMoreBtn handleLoadMoreClick={handleLoadMoreClick} />}
      {isEmpty && <Toaster />}
      <ImageModal
        isOpen={modal.isOpen}
        imgUrl={modal.imgUrl}
        imgAlt={modal.imgAlt}
        closeModal={closeModal}
      />
    </>
  );
}

  export default App;
