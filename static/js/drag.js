function enableDragging(block) {
    block.on("mousedown", function(event) {
        event.preventDefault();
        let selected = $(this);
        let initialX = event.clientX;
        let initialY = event.clientY;
        let initialLeft = parseInt(selected.css('left'));
        let initialTop = parseInt(selected.css('top'));

        function onMouseMove(event) {
            let newX = event.clientX - initialX + initialLeft;
            let newY = event.clientY - initialY + initialTop;
            selected.css({ left: newX + 'px', top: newY + 'px' });
        }

        function onMouseUp() {
            $(document).off("mousemove", onMouseMove);
            $(document).off("mouseup", onMouseUp);
            clearHighlighting();
            checkForSnapping(selected, '#workspace');
        }

        $(document).on("mousemove", onMouseMove);
        $(document).on("mouseup", onMouseUp);
    });
}

$(document).ready(function() {
    $(".draggable").each(function() {
        enableDragging($(this));
    });
});
