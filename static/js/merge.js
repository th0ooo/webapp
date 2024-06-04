function highlightPotentialSnapping(draggedItem, workspaceSelector) {
    let workspaceBlocks = $(workspaceSelector + " .draggable").not(draggedItem);
    let draggedWidth = draggedItem.width();
    let draggedHeight = draggedItem.height();
    let draggedOffset = draggedItem.offset();

    let draggedLeftActiveZone = {
        left: draggedOffset.left,
        right: draggedOffset.left + draggedWidth * 0.2,
        top: draggedOffset.top,
        bottom: draggedOffset.top + draggedHeight
    };

    let draggedRightActiveZone = {
        left: draggedOffset.left + draggedWidth * 0.8,
        right: draggedOffset.left + draggedWidth,
        top: draggedOffset.top,
        bottom: draggedOffset.top + draggedHeight
    };

    workspaceBlocks.each(function() {
        let block = $(this);
        let blockWidth = block.width();
        let blockHeight = block.height();
        let blockOffset = block.offset();

        let blockLeftActiveZone = {
            left: blockOffset.left,
            right: blockOffset.left + blockWidth * 0.2,
            top: blockOffset.top,
            bottom: blockOffset.top + blockHeight
        };

        let blockRightActiveZone = {
            left: blockOffset.left + blockWidth * 0.8,
            right: blockOffset.left + blockWidth,
            top: blockOffset.top,
            bottom: blockOffset.top + blockHeight
        };

        if (checkOverlap(draggedRightActiveZone, blockLeftActiveZone)) {
            block.css('border', '2px solid orange');
            draggedItem.css('border', '2px solid orange');
        } else if (checkOverlap(draggedLeftActiveZone, blockRightActiveZone)) {
            block.css('border', '2px solid orange');
            draggedItem.css('border', '2px solid orange');
        } else {
            block.css('border', '');
            draggedItem.css('border', '');
        }
    });
}

function clearHighlighting() {
    $(".draggable").css('border', '');
}

function checkForSnapping(draggedItem, workspaceSelector) {
    let workspaceBlocks = $(workspaceSelector + " .draggable").not(draggedItem);
    let draggedWidth = draggedItem.width();
    let draggedHeight = draggedItem.height();
    let draggedOffset = draggedItem.offset();

    let draggedLeftActiveZone = {
        left: draggedOffset.left,
        right: draggedOffset.left + draggedWidth * 0.2,
        top: draggedOffset.top,
        bottom: draggedOffset.top + draggedHeight
    };

    let draggedRightActiveZone = {
        left: draggedOffset.left + draggedWidth * 0.8,
        right: draggedOffset.left + draggedWidth,
        top: draggedOffset.top,
        bottom: draggedOffset.top + draggedHeight
    };

    workspaceBlocks.each(function() {
        let block = $(this);
        let blockWidth = block.width();
        let blockHeight = block.height();
        let blockOffset = block.offset();

        let blockLeftActiveZone = {
            left: blockOffset.left,
            right: blockOffset.left + blockWidth * 0.2,
            top: blockOffset.top,
            bottom: blockOffset.top + blockHeight
        };

        let blockRightActiveZone = {
            left: blockOffset.left + blockWidth * 0.8,
            right: blockOffset.left + blockWidth,
            top: blockOffset.top,
            bottom: blockOffset.top + blockHeight
        };

        if (checkOverlap(draggedRightActiveZone, blockLeftActiveZone)) {
            playSnapSound();
            mergeBlocks(block, draggedItem, 'right', workspaceSelector);
            return false;
        } else if (checkOverlap(draggedLeftActiveZone, blockRightActiveZone)) {
            playSnapSound();
            mergeBlocks(block, draggedItem, 'left', workspaceSelector);
            return false;
        }
    });
}

function checkOverlap(zone1, zone2) {
    return !(zone1.right < zone2.left || 
             zone1.left > zone2.right || 
             zone1.bottom < zone2.top || 
             zone1.top > zone2.bottom);
}

function playSnapSound() {
    let audio = new Audio('/static/audio/snap.mp3'); // Замените путь на правильный
    audio.play();
}

function mergeBlocks(block1, block2, side, workspaceSelector) {
    let block1Offset = block1.position();
    let block2Offset = block2.position();

    let newLeft = Math.min(block1Offset.left, block2Offset.left);
    let newTop = Math.min(block1Offset.top, block2Offset.top);

    let newBlockContainer = $('<div class="draggable"></div>').css({
        position: 'absolute',
        zIndex: 1000,
        left: newLeft,
        top: newTop,
        backgroundColor: 'transparent',
        border: '1px solid black'
    }).appendTo(workspaceSelector);

    let combinedWidth = block1.width() + block2.width();
    let combinedHeight = Math.max(block1.height(), block2.height());

    newBlockContainer.css({
        width: combinedWidth,
        height: combinedHeight
    });

    block1.css({
        position: 'absolute',
        left: 0,
        top: 0
    }).appendTo(newBlockContainer);

    block2.css({
        position: 'absolute',
        left: block1.width(),
        top: 0
    }).appendTo(newBlockContainer);

    block1.remove();
    block2.remove();

    enableDragging(newBlockContainer);
}
