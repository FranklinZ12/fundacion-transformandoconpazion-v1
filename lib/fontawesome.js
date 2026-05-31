import { config } from '@fortawesome/fontawesome-svg-core';
import '@fortawesome/fontawesome-svg-core/styles.css';

// Prevent FontAwesome from adding its CSS automatically
// since we import it manually above (avoids FOUC)
config.autoAddCss = false;
