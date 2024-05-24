<div id="screen_left">
    <?php
        if($_SESSION['mode'] === 2){
            echo '<div class="choice">';
            echo '  <div id="scoreView" class="clicked"></div>';
            echo '  <div id="streakView"></div>';
            echo '</div>';
        }
    ?>
    <div id="leaderboard">
        <input type="hidden" id="user" value="<?php echo (isset($_SESSION['username'])) ? $_SESSION['username'] : null;?>">
    </div>
    <div class="tutorial">
        <span id="case1"></span>
        <span id="case2"></span>
        <span id="case3"></span>
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
</div>