document.addEventListener('DOMContentLoaded', function () {
    const demoContainer = document.getElementById('demo-container');
    const videoModal = document.getElementById('video-modal');
    const modalVideo = videoModal.querySelector('.modal-video');
    const closeButton = videoModal.querySelector('.close-modal');
    const expandButton = document.querySelector('.expand-video');

    // Fonction pour ouvrir la modal
    function openModal() {
        videoModal.classList.add('active');
        modalVideo.play();
        // Pause la vidéo de démonstration
        const demoVideo = demoContainer.querySelector('.demo-video');
        demoVideo.pause();
    }

    // Fonction pour fermer la modal
    function closeModal() {
        videoModal.classList.remove('active');
        modalVideo.pause();
        // Reprend la lecture de la vidéo de démonstration
        const demoVideo = demoContainer.querySelector('.demo-video');
        demoVideo.play();
    }

    // Event listeners
    expandButton.addEventListener('click', openModal);
    closeButton.addEventListener('click', closeModal);

    // Fermer la modal si on clique en dehors de la vidéo
    videoModal.addEventListener('click', function (e) {
        if (e.target === videoModal) {
            closeModal();
        }
    });

    // Gérer la touche Echap
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeModal();
        }
    });
});
