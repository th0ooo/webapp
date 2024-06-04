$(document).ready(function() {
    // Добавление обработчиков событий для блоков в toolbox
    $("#toolbox .toolbox-item").on("mousedown", function(event) {
        event.preventDefault();

        let originalBlock = $(this);
        let newBlock = originalBlock.clone().appendTo("#workspace");

        // Устанавливаем начальную позицию блока под курсором
        let offsetX = event.pageX - originalBlock.offset().left;
        let offsetY = event.pageY - originalBlock.offset().top;

        newBlock.css({
            position: "absolute",
            left: event.pageX - offsetX,
            top: event.pageY - offsetY,
            zIndex: 1000
        }).addClass("draggable");

        log(`New block created at - left: ${newBlock.css('left')}, top: ${newBlock.css('top')}`);
        log(`Original block position in toolbox - left: ${originalBlock.offset().left}, top: ${originalBlock.offset().top}`);
        log(`Cursor position - pageX: ${event.pageX}, pageY: ${event.pageY}`);
        log(`Offsets - offsetX: ${offsetX}, offsetY: ${offsetY}`);

        // Следим за движением мыши для перемещения блока
        $(document).on("mousemove.newBlock", function(event) {
            let newLeft = event.pageX - offsetX;
            let newTop = event.pageY - offsetY;

            newBlock.css({
                left: newLeft,
                top: newTop
            });
            log(`Moving block - new position left: ${newLeft}px, top: ${newTop}px`);
            highlightPotentialSnapping(newBlock, '#workspace');
        });

        // Останавливаем перемещение блока при отпускании мыши
        $(document).on("mouseup.newBlock", function() {
            $(document).off("mousemove.newBlock");
            $(document).off("mouseup.newBlock");
            enableDragging(newBlock);
            checkForSnapping(newBlock, '#workspace');
        });
    });

    // Перетаскивание существующих блоков
    $(".draggable").each(function() {
        enableDragging($(this));
    });
});

function enableDragging(block) {
    block.on("mousedown", function(event) {
        dragBlock($(this), event);
    });
}

function dragBlock(block, event) {
    event.preventDefault();
    let initialX = event.clientX;
    let initialY = event.clientY;
    let initialLeft = parseInt(block.css('left'));
    let initialTop = parseInt(block.css('top'));

    logDragStart(initialX, initialY, initialLeft, initialTop);

    function onMouseMove(event) {
        let newX = event.clientX - initialX + initialLeft;
        let newY = event.clientY - initialY + initialTop;
        block.css({ left: newX + 'px', top: newY + 'px' });
        highlightPotentialSnapping(block, '#workspace');
    }

    function onMouseUp() {
        logDragEnd(block.css('left'), block.css('top'));
        $(document).off("mousemove", onMouseMove);
        $(document).off("mouseup", onMouseUp);
        checkForSnapping(block, '#workspace');
    }

    $(document).on("mousemove", onMouseMove);
    $(document).on("mouseup", onMouseUp);
}

function clearHighlighting() {
    $(".draggable").css('border', '');
}
