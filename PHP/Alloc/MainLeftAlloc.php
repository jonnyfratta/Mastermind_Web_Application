<div id="screen_left">
    <div id="leaderboard">
        <?php
            if($_SESSION['mode'] === 2){
                echo '<div class="choice">';
                echo '  <div id="scoreView" class="clicked"></div>';
                echo '  <div id="streakView"></div>';
                echo '</div>';
            }
        ?>
        <input type="hidden" id="user" value="<?php echo (isset($_SESSION['username'])) ? $_SESSION['username'] : null;?>">
    </div>
    <div class="tutorial legend">
        <div class="legend-item">
            <span class="legend-pin legend-black" aria-hidden="true"></span>
            <span id="case1"></span>
        </div>
        <div class="legend-item">
            <span class="legend-pin legend-white" aria-hidden="true"></span>
            <span id="case2"></span>
        </div>
        <div class="legend-item">
            <span class="legend-pin legend-empty" aria-hidden="true"></span>
            <span id="case3"></span>
        </div>
        <div class="legend-item">
            <span class="legend-pin legend-mixed" aria-hidden="true"></span>
            <span id="case4"></span>
        </div>
    </div>
</div>

<div id="screen_center">
    <table id="board">
        <thead>
            <tr>
                <td class="attempt" id="hidden"></td>
                <td class="outcome" id="none"></td>
            </tr>
        </thead>
        <tbody id="box">

        </tbody>
        <tfoot>
            <tr>
                <td class="attempt" id="current"></td>
                <td class="outcome" id="color_selection"></td>
            </tr>
        </tfoot>
    </table>
</div>
