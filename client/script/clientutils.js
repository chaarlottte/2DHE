class ClientUtils {
    isGameObjectVisible(gameObject, player, screenWidth, screenHeight) {
        const screenLeft = player.x - screenWidth / 2;
        const screenRight = player.x + screenWidth / 2;
        const screenTop = player.y - screenHeight / 2;
        const screenBottom = player.y + screenHeight / 2;

        const objectRight = gameObject.x + gameObject.w;
        const objectBottom = gameObject.y + gameObject.h;

        return (
            gameObject.x < screenRight &&
            objectRight > screenLeft &&
            gameObject.y < screenBottom &&
            objectBottom > screenTop
        );
    }
      
}

const utils = new ClientUtils();