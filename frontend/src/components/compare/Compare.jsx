import { ArrowLeftRight, LoaderCircle } from "lucide-react";
import CompareSearch from "./CompareSearch";
import ComparisonCard from "./ComparisonCard";

function Compare({locations, results, loading, error, onAdd, onRemove, onCompare}) {
  return (
    <section className="compare-page">
      <header className="compare-page__header">
        <div>
          <h1>Weather Comparison</h1>
          <p>
            Compare current weather conditions across different cities.
          </p>
        </div>
      </header>

      <CompareSearch
        locations={locations}
        onAdd={onAdd}
        onRemove={onRemove}
      />

      <button
        className="compare-page__button"
        type="button"
        onClick={onCompare}
        disabled={locations.length < 2 || loading}
      >
        {loading ? (
          <>
            <LoaderCircle className="spin" size={18} />
            Comparing...
          </>
        ) : (
          <>
            <ArrowLeftRight size={18} />
            Compare weather
          </>
        )}
      </button>

      {error && (
        <p className="compare-page__error">{error}</p>
      )}

      {results.length > 0 && (
        <div className="compare-page__results">
          {results.map((result) => (
            <ComparisonCard
              key={`${result.location.latitude}-${result.location.longitude}`}
              result={result}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Compare;
